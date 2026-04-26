# AI Resume Builder

A fullstack SaaS application that lets users create, edit, and export professional resumes with AI-assisted content generation, tiered subscription access, and real-time preview.

---

## Overview

**Problem:** Writing a professional resume is time-consuming and difficult without design or writing experience. Most tools are either too rigid or too expensive.

**What this project solves:** A web app where users input raw career data, receive AI-generated summaries and work experience bullets optimized for ATS systems, and export a formatted PDF — all within a subscription-gated product with three tiers.

**Why it is technically meaningful:** This project covers the full production SaaS loop: authentication, file storage, AI API integration, payment processing with webhooks, permission-based feature gating, and auto-persisted state — built entirely on modern Next.js patterns without a separate backend process.

---

## Key Features

### Authentication & Authorization
- Clerk-managed auth with sign-in/sign-up flows
- Subscription level resolved per-request from the database and propagated via React Context
- Permission functions (`canCreateResume`, `canUseAITools`, `canUseCustomizations`) applied on both server and client to prevent unauthorized access

### Resume Editor
- Six-step multi-form editor with breadcrumb navigation
- Auto-save triggered by debounced form state (1500ms delay), with dirty-state detection via JSON serialization comparison
- Drag-and-drop reordering of work experience and education entries (DnD Kit)
- Real-time preview panel with CSS `zoom` scaling to A4 dimensions
- Photo upload to Vercel Blob with automatic deletion on replace or removal
- Color picker and border style customization (gated to Pro Plus tier)

### AI Content Generation (Google Gemini)
- **Summary generation:** Accepts job title, work experience, education, and skills; returns an ATS-optimized 2–4 sentence professional summary
- **Work experience smart-fill:** User provides raw text; Gemini returns structured output parsed into typed fields (`position`, `company`, `startDate`, `endDate`, `description`)
- Language detection baked into prompts — output matches the predominant language of user input
- Server-side permission check before any AI call

### Payments & Subscriptions (Stripe)
- Three subscription tiers: Free, Pro (3 CVs + AI tools), Pro Plus (unlimited CVs + AI + customizations)
- Stripe Checkout sessions created via Server Actions
- Webhook handler at `/api/stripe-webhook` processes `checkout.session.completed`, `customer.subscription.created/updated/deleted`
- Idempotent upsert logic with fallback customer ID lookup to handle metadata gaps
- Customer portal session for self-serve subscription management

### PDF Export
- Print-to-PDF via `react-to-print`, targeting the live preview DOM node
- A4 page size enforced via `@page` CSS rule with `zoom: 1` override

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components, Server Actions) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui component primitives |
| **Database ORM** | Prisma with PostgreSQL (Vercel Postgres) |
| **Authentication** | Clerk |
| **Payments** | Stripe (Checkout, Customer Portal, Webhooks) |
| **AI** | Google Gemini (`gemini-3-flash-preview` via `@google/generative-ai`) |
| **File Storage** | Vercel Blob |
| **State Management** | Zustand (premium modal), React Hook Form, React `useState` |
| **Validation** | Zod (shared client/server schemas) |
| **Drag & Drop** | DnD Kit (`@dnd-kit/core`, `@dnd-kit/sortable`) |
| **Animations** | Framer Motion, canvas-confetti |
| **Deployment** | Vercel (implied by Vercel Blob and Postgres SDK usage) |

---

## Architecture & Code Structure
