<div align="center">
  <img src="src/assets/logo.png" alt="AI Resume Builder Banner" width="15%" />
  
  <h1>✨ AI Resume Builder</h1>
  
  <p><strong>A Fullstack SaaS application for creating ATS-optimized resumes with AI.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white" alt="Stripe" />
    <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Google Gemini" />
  </p>
</div>

---

## 📖 Overview

> **Problem:** Writing a professional resume is time-consuming and difficult without design or writing experience. Most tools are either too rigid, lack modern ATS optimization, or are prohibitively expensive.

**What this project solves:** A web application where users input raw career data, receive AI-generated professional summaries and work experience bullets, and export a perfectly formatted PDF — all within a tiered, subscription-gated product.

**Why it is technically meaningful:** This project covers the complete production SaaS lifecycle: authentication, cloud file storage, generative AI integration, payment processing with complex webhooks, permission-based feature gating, and auto-persisted state — built entirely on modern **Next.js App Router** patterns.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization
- **Clerk Auth:** Secure sign-in/sign-up flows and user management.
- **Dynamic Permissions:** Subscription levels are resolved per-request and propagated via React Context. Functions like `canCreateResume` or `canUseAITools` are strictly applied on both client and server to prevent IDOR and unauthorized access.

### 📝 Smart Resume Editor
- **Multi-step UI:** A six-step guided form editor with breadcrumb navigation.
- **Auto-save System:** Triggered by debounced form state (1500ms), utilizing deep JSON serialization comparison to detect dirty states and prevent unnecessary DB writes.
- **Rich Interactions:** Drag-and-drop reordering for work/education entries using **DnD Kit**.
- **Real-time Preview:** A live split-screen preview panel utilizing CSS `zoom` to strictly maintain A4 dimensions dynamically.
- **Cloud Storage:** Direct photo uploads to **Vercel Blob** with automatic cleanup for orphaned files.

### 🤖 AI Content Generation (Google Gemini)
- **ATS-Optimized Summaries:** Generates 2–4 sentence professional summaries based on provided job titles, experiences, and skills.
- **Smart-fill Experience:** Converts raw, informal user text into structured, action-verb-driven bullet points parsed into exact database fields.
- **Context-Aware Language:** Prompts automatically detect the user's predominant input language (e.g., Vietnamese) while adhering to strict English system guidelines.

### 💳 Payments & Subscriptions (Stripe)
- **SaaS Tiers:** Free, Pro (3 CVs + AI tools), and Pro Plus (Unlimited + AI + Customizations).
- **Checkout & Portal:** Stripe Checkout sessions created via Server Actions, with full Customer Portal support.
- **Robust Webhooks:** Secure handler at `/api/stripe-webhook` managing checkout completions and subscription lifecycles. Uses idempotent upsert logic and fallback customer ID lookups to handle metadata gaps flawlessly.

### 🖨️ PDF Export
- High-fidelity PDF generation via `react-to-print` targeting the live DOM node, with `@page` CSS overrides to ensure perfect A4 print bounds.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components, Server Actions) |
| **Language** | TypeScript |
| **Styling & UI** | Tailwind CSS v4, shadcn/ui, Framer Motion, canvas-confetti |
| **Database & ORM** | PostgreSQL (Vercel Postgres), Prisma ORM |
| **Auth & Payments**| Clerk, Stripe |
| **AI Integration** | Google Gemini (`gemini-3-flash-preview`) |
| **State & Forms** | Zustand, React Hook Form, Zod (Validation) |
| **Utilities** | DnD Kit (Drag & Drop), date-fns |

---

## 💻 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18.x or higher)
- A PostgreSQL database (e.g., Supabase, Vercel Postgres, or local)
- Accounts for Clerk, Stripe, and Google AI Studio (Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/ai-resume-builder.git](https://github.com/yourusername/ai-resume-builder.git)
   cd ai-resume-builder
