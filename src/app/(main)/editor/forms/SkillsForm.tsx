import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SkillsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resumeData.skills || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      const rawSkills = values.skills as unknown;

      const skillsArray = Array.isArray(rawSkills)
        ? (rawSkills as string[])
        : typeof rawSkills === "string"
          ? (rawSkills as string).split(",")
          : [];

      setResumeData({
        ...resumeData,
        skills: skillsArray
          .filter((skill: string) => skill !== undefined)
          .map((skill: string) => skill.trim())
          .filter((skill: string) => skill !== ""),
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Kỹ năng</h2>
        <p className="text-muted-foreground text-sm">Bạn giỏi những gì?</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Kỹ năng</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={
                      Array.isArray(field.value)
                        ? field.value.join(", ")
                        : field.value
                    }
                    placeholder="VD: Làm việc nhóm, Thiết kế đồ họa, ..."
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    onBlur={(e) => {
                      const skillsArray = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s !== "");
                      field.onChange(skillsArray);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Phân cách mỗi kỹ năng bằng dấu phẩy.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
