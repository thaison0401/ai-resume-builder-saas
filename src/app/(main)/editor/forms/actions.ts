"use server";

import genAI from "@/lib/gemini";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import {
  generateSummarySchema,
  GenerateSummaryInput,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canUseAITools } from "@/lib/permissions";

// --- Cấu hình dùng chung cho Model Gemini ---
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// --- HÀM HELPER: Dùng chung để kiểm tra quyền sử dụng AI ---
async function assertCanUseAITools() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }
}

export async function generateSummary(input: GenerateSummaryInput) {
  // Gọi hàm kiểm tra quyền gọn gàng
  await assertCanUseAITools();

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const prompt = `
  You are an expert ATS-optimized job resume generator. Your task is to write a professional introduction summary for a resume based STRICTLY on the user's provided data.
  Only return the summary and do not include any other information or greetings.

  CRITICAL INSTRUCTIONS FOR QUALITY:
  1. DO NOT invent, assume, or fabricate any experience, company, metric, or skill not explicitly provided.
  2. AVOID generic, cliché phrases like "Highly motivated", "team player", "hard-working", or "passionate".
  3. PRIORITIZE work experience over education, and education over skills when generating the summary.
  4. Focus on SPECIFIC technologies, concrete achievements, and actual responsibilities derived from the data.
  5. Keep the summary concise: strictly between 2 to 4 sentences maximum.
  6. If the provided data is insufficient, extremely short, or unclear, generate a minimal, honest response without exaggeration.

  CRITICAL INSTRUCTIONS FOR LANGUAGE:
  1. Detect the PREDOMINANT (majority) language used inside the <USER_DATA> tags.
  2. IF the user explicitly requests a specific language (e.g., "dịch sang tiếng Anh", "write in English"), you MUST honor that request.
  3. OTHERWISE, generate the summary ENTIRELY in the predominant language.
  4. NEVER mix languages in the final output.

  <USER_DATA>
  Job title: ${jobTitle || "N/A"}
  
  Work experience:
  ${workExperiences
    ?.map(
      (exp) => `
    Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}
    Description: ${exp.description || "N/A"}
    `,
    )
    .join("\n\n")}

    Education:
    ${educations
      ?.map(
        (edu) => `
    Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "Present"}
    `,
      )
      .join("\n\n")}

    Skills:
    ${skills?.filter((s) => s.trim()).join(", ") || "N/A"} 
  </USER_DATA>
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    safetySettings,
  });
  const result = await model.generateContent(prompt);
  const aiResponse = result.response.text();

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return aiResponse;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  // Gọi hàm kiểm tra quyền gọn gàng
  await assertCanUseAITools();

  const { description } = generateWorkExperienceSchema.parse(input);

  const prompt = `
  You are an expert ATS-optimized job resume generator. Your task is to generate a single work experience entry based STRICTLY on the user input.
  Your response must adhere to the following structure exactly. You can omit fields if they can't be inferred from the provided data, but DO NOT add any new ones.
  
  Job title: <job title>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if clearly provided)
  End date: <format: YYYY-MM-DD> (only if clearly provided)
  Description: <an optimized description>

  CRITICAL INSTRUCTIONS FOR CONTENT QUALITY:
  1. DO NOT invent or fabricate any information.
  2. If dates are unclear or missing, omit them completely instead of guessing.
  3. The Description MUST be in bullet points (strict limit: 3 to 5 bullets).
  4. Each bullet MUST start with a strong, impactful action verb (e.g., Built, Engineered, Implemented, Optimized, Spearheaded). Avoid weak verbs like "Helped", "Assisted", or "Handled".
  5. Focus on measurable impact and realistic contributions. If the input is simple or amateur (e.g., "em mới học"), DO NOT exaggerate it into senior-level experience. Keep it honest and appropriate.

  CRITICAL INSTRUCTIONS FOR PARSING & LANGUAGE:
  1. DO NOT use Markdown bolding (**) or any other formatting for the labels. Just output plain text labels exactly like "Job title:"
  2. DO NOT translate the structured labels ("Job title:", "Company:", "Start date:", "End date:", "Description:"). Keep them exactly as written in English.
  3. IF A FIELD IS MISSING (e.g., no company provided), LEAVE IT COMPLETELY BLANK after the colon. DO NOT write "N/A", "None", "description", or any placeholders.
  4. Detect the language inside the <USER_INPUT> tags. 
  5. IF the user explicitly asks to translate or write in a specific language (e.g., "viết bằng tiếng Anh"), follow that instruction for the VALUES. OTHERWISE, keep the VALUES in the same language as the input.

  Please provide a work experience entry from this description:
  <USER_INPUT>
  ${description}
  </USER_INPUT>
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    safetySettings,
  });
  const result = await model.generateContent(prompt);
  const aiResponse = result.response.text();

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return {
    position: aiResponse.match(/Job title:[ \t]*([^\n]*)/i)?.[1]?.trim() || "",
    company: aiResponse.match(/Company:[ \t]*([^\n]*)/i)?.[1]?.trim() || "",
    description: (
      aiResponse.match(/Description:\s*([\s\S]*)$/i)?.[1] || ""
    ).trim(),
    startDate: aiResponse.match(/Start date:[ \t]*(\d{4}-\d{2}-\d{2})/i)?.[1],
    endDate: aiResponse.match(/End date:[ \t]*(\d{4}-\d{2}-\d{2})/i)?.[1],
  } satisfies WorkExperience;
}
