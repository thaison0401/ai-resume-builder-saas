<div align="center">
  <img src="./src/assets/logo.png" alt="AI Resume Builder" width="100px" />

  <h1>AI Resume Builder</h1>

  <p><strong>A fullstack SaaS application for building ATS-optimized resumes with AI-assisted content generation, tiered subscription access, and real-time PDF preview.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=prisma&logoColor=white" />
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white" />
    <img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" />
    <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=google&logoColor=white" />
    <img src="https://img.shields.io/badge/Clerk-6C47FF?style=flat-square" />
    <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel" />
  </p>
</div>

---

## Table of Contents

- [Live Demo](#live-demo)
- [Overview](#overview)
- [Why This Project Stands Out](#why-this-project-stands-out)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Engineering Challenges Solved](#engineering-challenges-solved)
- [Setup](#setup)
- [Future Improvements](#future-improvements)

---

## Live Demo

> 🔗 **[https://ai-resume-builder-saas-av16.vercel.app/](https://your-deployment-url.vercel.app)**  
> _Replace with your live Vercel URL before publishing._

---

## Overview

Most resume tools are either too rigid to personalize or too expensive to be worth it for students and early-career candidates. This project is a SaaS web app where users build professional resumes through a guided editor, generate AI-written content from their raw notes, and export a formatted A4 PDF — all within a three-tier subscription product.

The entire stack — auth, database, AI, payments, file storage — runs inside a single Next.js 15 App Router application with no separate backend service.

---

## Why This Project Stands Out

- **Complete SaaS loop in one codebase** — authentication, AI integration, Stripe billing with webhook lifecycle handling, cloud file storage, and PDF export, without a dedicated backend service or REST API layer
- **Server-side enforcement throughout** — every subscription permission is validated on the server inside Server Actions, not just in the UI; bypassing client-side gating does not grant access
- **Production-oriented decisions** — idempotent Stripe webhook handling, Vercel Blob lifecycle management on every save, and hydration-safe Clerk rendering reflect real deployment concerns, not just feature completion

---

## Screenshots

> 📸 **Screenshots will be added after deployment.**  
> To add: save captures of the pages below to `./docs/screenshots/`, then uncomment the table.

<!--
| Landing Page | Resume Editor |
|---|---|
| ![Landing](./docs/screenshots/landing.png) | ![Editor](./docs/screenshots/editor.png) |

| AI Generation | Billing & Subscription |
|---|---|
| ![AI](./docs/screenshots/ai-generation.png) | ![Billing](./docs/screenshots/billing.png) |
-->

**Pages to capture:** Landing · Resume Editor · AI Generation dialog · Billing page · PDF export result

---

## Features

### Resume Editor
- Build a resume through six guided steps; progress is auto-saved as you type
- See a live A4-proportioned preview update in real time alongside the form
- Reorder work experience and education entries by drag-and-drop
- Upload a profile photo; replacing or removing it cleans up the old file automatically
- Customizable accent color and photo border style (Pro Plus tier)

### AI Content Generation
- Describe your job experience in plain language — AI reformats it into professional bullet points with strong action verbs
- Generate an ATS-optimized 2–4 sentence profile summary from your existing resume data
- Input in Vietnamese or English; output matches your language automatically
- AI features available on Pro and Pro Plus tiers only

### Authentication
- Sign up and sign in managed by Clerk
- All resume data is scoped to your account; routes are protected at the middleware level

### Subscription & Billing
- **Free:** 1 CV, basic editor, PDF export
- **Pro:** Up to 3 CVs, AI tools unlocked
- **Pro Plus:** Unlimited CVs, all AI tools, color and border customization
- Upgrade via Stripe Checkout; manage or cancel through the Stripe Customer Portal

### PDF Export
- Export any resume to a formatted A4 PDF directly from the live preview

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 — App Router, Server Components, Server Actions |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **Database** | PostgreSQL via Prisma ORM (Vercel Postgres) |
| **Authentication** | Clerk |
| **Payments** | Stripe (Checkout, Webhooks, Customer Portal) |
| **AI** | Google Gemini (`gemini-3-flash-preview`) |
| **File Storage** | Vercel Blob |
| **State Management** | Zustand (global modal), React Hook Form (forms) |
| **Validation** | Zod — shared schemas across client and server |
| **Drag & Drop** | DnD Kit |
| **Deployment** | Vercel |

---

## Architecture

```
src/
├── app/
│   ├── (auth)/                        # Clerk sign-in / sign-up route group
│   ├── (main)/                        # Authenticated shell — shared Navbar, layout
│   │   ├── editor/
│   │   │   ├── forms/                 # One form component per editor step
│   │   │   ├── actions.ts             # Server Action: saveResume
│   │   │   └── useAutoSaveResume.tsx  # Debounced save hook with dirty detection
│   │   ├── resumes/                   # Resume list, create, delete
│   │   ├── billing/                   # Subscription page, portal redirect, success
│   │   └── SubscriptionLevelProvider.tsx
│   ├── api/stripe-webhook/            # Stripe event handler (POST)
│   ├── page.tsx                       # Public landing page
│   └── layout.tsx                     # Root layout — fonts, ThemeProvider, Toaster
├── components/
│   ├── premium/                       # PremiumModal + createCheckoutSession action
│   ├── ui/                            # shadcn/ui primitives
│   └── ResumePreview.tsx              # Stateless A4 renderer
├── hooks/                             # useDebounce · useDimensions · usePremiumModal · useUnloadWarning
└── lib/
    ├── permissions.ts                 # Pure functions: canCreateResume, canUseAITools, canUseCustomizations
    ├── subscription.ts                # Cached DB lookup + priceId → tier mapping
    ├── validation.ts                  # Zod schemas — single source of truth
    └── utils.ts                       # fileReplacer · mapToResumeValues · cn()
```

**Architectural decisions worth noting:**

**No separate backend.** All mutations use Next.js Server Actions. The only `api/` route is the Stripe webhook, which requires a raw POST handler. Everything else — saving resumes, triggering AI, creating checkout sessions — runs inside Server Actions that execute on the server with full access to environment secrets and Prisma.

**Single Zod schema layer.** `lib/validation.ts` defines all data shapes once. React Hook Form resolvers consume them on the client; Server Actions parse and validate incoming data with the same schemas on the server. No duplication, no drift between client and server expectations.

**Subscription tier resolved at layout level.** `SubscriptionLevelProvider` reads the user's tier once in the authenticated layout via a cached Prisma query, then distributes it via React Context. No component below it touches the database to answer "what plan is this user on?".

**Pure permission functions.** `lib/permissions.ts` has no framework imports. Each function takes a subscription level and returns a boolean. They are called in Server Actions (to reject requests) and in components (to show or hide the premium modal). The same function, both places.

---

## Engineering Challenges Solved

### 1. Stripe Webhook Idempotency and Missing Metadata

Stripe can deliver `subscription.updated` events where `userId` is absent from subscription metadata — this happens when subscriptions are created or modified outside the checkout flow. Without a fallback, these events silently fail and leave users on Free despite a completed payment.

The handler first checks `subscription.metadata.userId`. If absent, it performs a secondary Prisma lookup by `stripeCustomerId` using `??=` to avoid querying twice. All subscription writes use Prisma `upsert`, so replayed webhook events produce the same result as the first delivery.

### 2. Auto-Save with File-Object Dirty Detection

Debouncing form state at 1500ms is straightforward. The hard part is determining whether the data actually changed when the state includes `File` instances — `File` objects are not JSON-serializable and fail reference comparison across re-renders.

A custom `fileReplacer` passed to `JSON.stringify` reduces `File` objects to a stable plain-object representation `{ name, size, type, lastModified }`. The same replacer runs on both the current state and the last-saved snapshot. When no photo change is detected, `photo: undefined` is sent in the payload, skipping the Vercel Blob upload entirely. Saves are also skipped when a prior save is in-flight or the previous attempt errored.

### 3. Structured Output from a Generative Model

Gemini returns plain text, not typed JSON. The work experience prompt defines a strict labeled format (`Job title:`, `Company:`, `Start date:`, `End date:`, `Description:`) and explicitly instructs the model against markdown formatting, placeholder values, and invented data. The server parses the response with named regex captures into a typed `WorkExperience` object. Both prompts include language detection instructions — output language matches the predominant language of user input.

### 4. Permission Enforcement That Cannot Be Bypassed Client-Side

Every premium feature has two enforcement points. On the client, permission functions determine whether to open the premium modal or proceed. On the server, the same permission function runs inside the Server Action before any work happens. A user who bypasses the client-side check — through DevTools or a direct fetch — hits the same rejection on the server. The UI and the server each enforce independently.

### 5. Vercel Blob File Lifecycle on Every Save

Without explicit cleanup, every resume save that changes the photo would leave the previous blob URL orphaned in storage with no way to find or delete it later.

`saveResume` handles three cases explicitly: if `photo` is a `File` instance, the old blob URL is deleted before uploading the new one; if `photo` is `null`, the blob is deleted and the database field is set to null; if `photo` is `undefined` (not changed), neither action runs. This keeps storage in sync with database state on every mutation.

### 6. Hydration-Safe Theme-Dependent Clerk Rendering

Clerk's `UserButton` accepts a `baseTheme` prop that reads `resolvedTheme` from `next-themes`. On the server, `resolvedTheme` is unavailable, so SSR and client render different output — causing a React hydration error in production.

The fix gates the `UserButton` render behind a `mounted` boolean flag set in `useEffect`. A skeleton placeholder with identical dimensions renders on first paint, then swaps out after mount. Layout does not shift; hydration does not fail.

---

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Vercel Postgres)
- Accounts: [Clerk](https://clerk.dev) · [Stripe](https://stripe.com) · [Google AI Studio](https://aistudio.google.com) · [Vercel Blob](https://vercel.com/storage/blob)

### Install

```bash
git clone https://github.com/thaison0401/ai-resume-builder.git
cd ai-resume-builder
npm install
```

### Environment Variables

Create `.env.local` at the project root:

```env
# Database
DATABASE_URL=
POSTGRES_URL_NON_POOLING=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY=

# AI & Storage
GEMINI_API_KEY=
BLOB_READ_WRITE_TOKEN=

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Run

```bash
npx prisma db push
npm run dev
```

```bash
# Separate terminal — Stripe local testing
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

---

## Future Improvements

- **Multiple resume templates** — the preview renderer is stateless; adding a `template` prop requires no schema or architecture change
- **AI rate limiting** — Server Actions currently rely on subscription checks only; an Upstash Redis rate limiter would prevent prompt abuse at scale
- **Resume analytics** — view and download counts via an event table in the existing Prisma schema, minimal migration required
- **E2E tests** — permission functions and the webhook handler are unit-testable in isolation; Playwright could cover the editor → save → billing flow end-to-end

---

<details>
<summary><strong>📄 Resume-Oriented Impact Bullets</strong> &nbsp;—&nbsp; for CV/portfolio reference</summary>

<br />

- **Built** a fullstack SaaS resume builder with Next.js 15 App Router, integrating Google Gemini for AI-generated ATS-optimized content and Stripe for three-tier subscription management with webhook-driven state synchronization
- **Implemented** a Stripe webhook handler with signature verification, idempotent upsert logic, and fallback customer ID lookup — ensuring reliable subscription lifecycle management across metadata edge cases
- **Designed** a shared Zod validation layer consumed by both React Hook Form (client) and Server Actions (server), enforcing type-safe data flow without schema duplication across a six-step multi-form editor
- **Engineered** a debounced auto-save system with `File`-aware dirty-state detection using a custom JSON replacer, preventing redundant database writes and blob re-uploads during real-time editing
- **Architected** a subscription-gated permission system with dual client-server enforcement, eliminating per-component database queries via React Context propagation of the resolved subscription tier
- **Integrated** Vercel Blob for resume photo storage with explicit lifecycle management — uploading, replacing, and nulling blobs atomically alongside Prisma updates to prevent orphaned storage objects

</details>

---

<div align="center">
  <p>Built by <strong>Tran Thai Son</strong> &nbsp;·&nbsp; Information Technology Student</p>
  <a href="https://github.com/thaison0401">github.com/thaison0401</a>
  <br /><br />
  <p>If this project was useful, consider leaving a ⭐</p>
</div>
