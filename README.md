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
    <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square" />
  </p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture & Code Structure](#architecture--code-structure)
- [Engineering Highlights](#engineering-highlights)
- [Technical Challenges Solved](#technical-challenges-solved)
- [Resume Bullets](#resume-bullets)
- [Setup](#setup)
- [Future Improvements](#future-improvements)

---

## Overview

**Problem:** Writing a professional resume demands both design skill and strong written English — two things most job seekers lack. Existing tools are either too rigid or paywalled for basic functionality.

**What this project does:** Users input raw career data through a guided multi-step editor, receive AI-generated summaries and work experience bullets optimized for ATS systems, then export a formatted A4 PDF — all within a subscription-gated product with three access tiers.

**Why it is technically meaningful:** This project covers the complete production SaaS loop — authentication, cloud file storage, generative AI integration with structured output parsing, Stripe payment processing with webhook lifecycle handling, permission-based feature gating, and auto-persisted client state — built entirely within Next.js 15 App Router without a separate backend service.

---

## Key Features

### Resume Editor
- Six-step guided editor with breadcrumb navigation and URL-persisted step state
- Real-time A4 preview rendered alongside the form, scaled via CSS `zoom` calculated from a `ResizeObserver`
- Drag-and-drop reordering of work experience and education entries (DnD Kit)
- Profile photo upload to Vercel Blob with automatic deletion on replacement or removal
- Unsaved-changes warning via `beforeunload` event listener

### AI Content Generation
- **Summary generation:** Accepts job title, experience, education, and skills; returns a 2–4 sentence ATS-optimized profile via Google Gemini
- **Work experience smart-fill:** User provides unformatted text; Gemini returns a structured entry parsed server-side via regex into typed `position`, `company`, `startDate`, `endDate`, and `description` fields
- Language-aware prompting — output matches the predominant language of user input
- All AI calls are gated behind server-side subscription permission checks

### Authentication & Authorization
- Clerk-managed sign-in/sign-up with route protection via `clerkMiddleware`
- Subscription level resolved once at layout level and propagated via React Context — no per-component DB calls
- Permission functions (`canCreateResume`, `canUseAITools`, `canUseCustomizations`) enforced on both client (to trigger premium modal) and server (to reject the action)

### Payments & Subscriptions
- Three tiers: **Free** (1 CV), **Pro** (3 CVs + AI tools, 99k VND/month), **Pro Plus** (unlimited CVs + AI + customizations, 199k VND/month)
- Stripe Checkout sessions created via Server Actions with locale set to `vi`
- Webhook handler at `/api/stripe-webhook` processes `checkout.session.completed`, `subscription.created/updated/deleted`
- Self-serve billing management via Stripe Customer Portal

### PDF Export
- Print-to-PDF via `react-to-print` targeting the live preview DOM node
- A4 page dimensions enforced via `@page` CSS rule; `zoom` overridden to `1` at print time

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 — App Router, Server Components, Server Actions |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui component primitives |
| **Database** | PostgreSQL via Prisma ORM (Vercel Postgres) |
| **Authentication** | Clerk |
| **Payments** | Stripe (Checkout, Webhooks, Customer Portal) |
| **AI** | Google Gemini (`gemini-3-flash-preview`) |
| **File Storage** | Vercel Blob |
| **State Management** | Zustand (global modal state), React Hook Form (form state) |
| **Validation** | Zod — shared schemas across client and server |
| **Drag & Drop** | DnD Kit (`@dnd-kit/core`, `@dnd-kit/sortable`) |
| **Animations** | Framer Motion, canvas-confetti |
| **Deployment** | Vercel |

---

## Architecture & Code Structure

```
src/
├── app/
│   ├── (auth)/                   # Clerk sign-in / sign-up route group
│   ├── (main)/                   # Authenticated app shell with shared Navbar
│   │   ├── editor/               # Resume editor — forms, preview, auto-save
│   │   │   ├── forms/            # Per-step form components + AI action buttons
│   │   │   ├── actions.ts        # Server Action: saveResume (upsert + blob lifecycle)
│   │   │   └── useAutoSaveResume.tsx   # Debounced auto-save hook with dirty detection
│   │   ├── resumes/              # Resume list, creation button, delete action
│   │   ├── billing/              # Subscription page, Stripe portal, success page
│   │   └── SubscriptionLevelProvider.tsx  # React Context: propagates resolved tier
│   ├── api/stripe-webhook/       # Stripe event POST handler
│   ├── page.tsx                  # Public landing page
│   └── layout.tsx                # Root layout — fonts, theme provider, Toaster
├── components/
│   ├── premium/                  # PremiumModal (Zustand-driven) + checkout action
│   ├── ui/                       # shadcn/ui primitives
│   └── ResumePreview.tsx         # Stateless A4 preview renderer
├── hooks/                        # useDebounce, useDimensions, usePremiumModal, useUnloadWarning
├── lib/
│   ├── permissions.ts            # Pure functions: feature access rules by subscription level
│   ├── subscription.ts           # Cached DB lookup + priceId → tier mapping
│   ├── validation.ts             # Zod schemas — single source of truth for all data shapes
│   └── utils.ts                  # fileReplacer, mapToResumeValues, cn()
└── middleware.ts                 # Clerk route protection with public route matcher
```

**Key architectural patterns:**
- **Server Actions** replace REST endpoints for all mutations — no separate API layer
- **Route Groups** `(auth)` / `(main)` isolate layout trees without affecting URL structure
- **Shared Zod schemas** consumed by React Hook Form resolvers (client) and Server Action parsers (server) — one schema, zero duplication
- **Pure permission functions** in `lib/permissions.ts` keep authorization logic outside components and decoupled from UI framework
- **React Context at layout level** resolves and distributes subscription tier once per request, not per component

---

## Engineering Highlights

### Stripe Webhook Reliability
The handler at `/api/stripe-webhook` verifies the Stripe signature before processing any event. For `subscription.created/updated`, if `userId` is absent from subscription metadata — possible when subscriptions are created outside the normal checkout flow — the handler falls back to a secondary DB lookup by `stripeCustomerId`. A `??=` lazy assignment avoids redundant queries. All subscription state is written via Prisma `upsert`, making the handler fully idempotent.

### Debounced Auto-Save with File-Aware Dirty Detection
`useAutoSaveResume` debounces resume state at 1500ms, then compares the current snapshot against the last-saved snapshot using `JSON.stringify` with a custom `fileReplacer`. This replacer serializes `File` objects (non-serializable by default) as plain objects `{ name, size, type, lastModified }` for stable comparison. When no photo change is detected, `photo: undefined` is passed in the save payload — preventing unnecessary Vercel Blob re-uploads. Saves are skipped entirely if data is unchanged, a save is already in-flight, or the previous attempt errored.

### Subscription-Gated Feature System
`lib/permissions.ts` exports three pure functions — `canCreateResume`, `canUseAITools`, `canUseCustomizations` — checked independently on the client (to open the premium modal) and re-checked on the server inside Server Actions (to reject unauthorized calls). This dual-enforcement pattern ensures UI state and server enforcement cannot desync, regardless of client-side manipulation.

### AI Structured Output Parsing
Google Gemini does not return JSON in this implementation. The work experience prompt instructs the model to respond in a strict labeled plain-text format (`Job title:`, `Company:`, `Start date:`, etc.) with explicit instructions against markdown formatting or placeholder text. The server parses the response using named regex captures into a typed `WorkExperience` object. Both prompts include language detection instructions so output matches the user's input language.

### Vercel Blob File Lifecycle
Every `saveResume` call explicitly manages blob state: if the user changed their photo, the old blob URL is deleted before uploading the new file; if `photo` is `null`, the blob is deleted and the DB field nulled. This prevents orphaned blobs from accumulating in storage across resume updates.

### Hydration-Safe Theme-Aware Clerk UI
`Navbar.tsx` gates the render of Clerk's `UserButton` behind a `mounted` state flag. Without this, Next.js SSR renders the component before `resolvedTheme` is available, causing a hydration mismatch. The skeleton fallback (`animate-pulse` div) maintains layout stability during the mount cycle.

---

## Technical Challenges Solved

**1. Structured output from a generative model without JSON mode**
Gemini's response must be parsed into typed fields server-side. The solution required designing a prompt format strict enough to prevent the model from adding markdown, inventing data, or using placeholder strings — then validating the parsed output before returning it to the client.

**2. Webhook idempotency under missing metadata**
Stripe can deliver webhook events where `subscription.metadata.userId` is absent. Without the fallback lookup by `stripeCustomerId`, these events would silently fail and leave users on the Free tier despite a successful payment. The fix adds a secondary DB query only when needed, keeping the happy path fast.

**3. `File` object serialization in change detection**
`File` instances from `<input type="file">` fail with `JSON.stringify` and cannot be compared by reference across re-renders. A custom `fileReplacer` reduces them to a stable plain-object representation. This same replacer is used in the save-skip logic, ensuring photo changes trigger saves while identical photos do not.

**4. CSS zoom-based A4 scaling without media queries**
The preview must render at true A4 proportions regardless of container width. A `ResizeObserver` tracks the container's pixel width via a custom `useDimensions` hook, and the inner content is scaled with `zoom: (1 / 794) * containerWidth` — keeping the resume visually accurate at any viewport size without layout recalculation.

---

## Resume Bullets

- **Built** a fullstack SaaS resume builder with Next.js 15 App Router, integrating Google Gemini for AI-generated ATS-optimized content and Stripe for three-tier subscription management with webhook-driven state synchronization
- **Implemented** a Stripe webhook handler with signature verification, idempotent upsert logic, and fallback customer ID lookup, ensuring reliable subscription lifecycle management across metadata edge cases
- **Designed** a shared Zod validation layer consumed by both React Hook Form (client) and Server Actions (server), enforcing type-safe data flow without schema duplication across a six-step multi-form editor
- **Engineered** a debounced auto-save system with `File`-aware dirty-state detection using a custom JSON replacer, preventing redundant database writes and blob re-uploads during real-time editing
- **Architected** a subscription-gated permission system using pure functions enforced on both client and server, with React Context propagation of the resolved tier at layout level to eliminate per-component database queries
- **Integrated** Vercel Blob for resume photo storage with explicit lifecycle management — uploading, replacing, and nulling blobs atomically alongside Prisma database updates to prevent orphaned storage objects

---

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Vercel Postgres)
- Clerk, Stripe, Google AI Studio, and Vercel Blob accounts

### Installation

```bash
git clone https://github.com/thaison0401/ai-resume-builder.git
cd ai-resume-builder
npm install
```

### Environment Variables

Create `.env.local`:

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

### Database & Dev Server

```bash
npx prisma db push
npm run dev
```

For Stripe webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

---

## Future Improvements

- **Multiple resume templates** — the preview renderer is stateless and data-driven; adding a `template` prop with alternate layout components is architecturally straightforward
- **Rate limiting on AI endpoints** — Server Actions currently rely on subscription checks but have no per-user request cap; a Redis-backed rate limiter (Upstash) would prevent prompt abuse
- **Resume analytics** — track view and download counts per resume using an event table in the existing Prisma schema with minimal schema migration
- **E2E test coverage** — the permission functions and webhook handler are unit-testable in isolation; Playwright could cover the full editor → save → billing flow

---

<div align="center">
  <p>Built by <strong>Tran Thai Son</strong> — Information Technology Student</p>
  <p>
    <a href="https://github.com/thaison0401">GitHub</a>
  </p>
  <p>If you found this project useful, consider giving it a ⭐</p>
</div>
