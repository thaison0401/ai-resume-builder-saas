<div align="center">
  <img src="./src/assets/logo.png" alt="AI Resume Builder Banner" width="15%" />
  
  <h1>✨ AI Resume Builder</h1>
  
  <p><strong>A Fullstack SaaS application for creating ATS-optimized resumes with AI.</strong></p>

<p>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=prisma&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/Stripe-Billing-635BFF?style=flat-square&logo=stripe" />
  <img src="https://img.shields.io/badge/Gemini-AI-8E75B2?style=flat-square" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql" />
</p>

</div>

---

## 📌 Table of Contents

* Overview
* Core Features
* Screenshots
* Tech Stack
* Architecture
* Engineering Challenges Solved
* Getting Started
* Future Improvements

---

## 📖 Overview

> **Problem**
> Traditional resume builders are often rigid, poorly optimized for ATS parsing, or expensive.

**Solution**
AI Resume Builder allows users to create professional resumes through a guided editor, generate AI-enhanced content, manage subscription plans, and export polished PDFs.

**Why this project matters technically**
This project covers a realistic SaaS product lifecycle:

* Authentication and protected routes
* AI integration with structured output parsing
* Payment processing with webhook lifecycle handling
* Permission-based subscription gating
* Auto-persisted resume editing state
* Cloud storage and PDF export

Built using modern **Next.js App Router** patterns with fullstack production-oriented architecture.

---

## 🚀 Core Features

### User Features

* Multi-step resume builder with live preview
* AI-generated summaries and work experience bullets
* Drag-and-drop section reordering
* ATS-friendly PDF export
* Profile image upload via cloud storage

### SaaS Features

* Clerk authentication and protected user flows
* Free / Pro / Pro Plus subscription tiers
* Stripe checkout and billing portal integration
* Permission-gated feature access based on subscription plan

<details>
<summary><b>Technical Implementation Details</b></summary>

### Smart Resume Editor

* Debounced autosave (1500ms) with dirty-state detection using deep JSON comparisons
* Real-time A4 preview rendering using CSS zoom scaling
* DnD Kit integration for work and education reordering
* Automatic orphaned file cleanup for uploaded assets

### AI Content Generation

* ATS-optimized professional summary generation
* Informal input transformed into structured bullet points
* Language-aware prompting with constrained English output

### Payments

* Secure Stripe webhook handling at `/api/stripe-webhook`
* Idempotent subscription upserts
* Fallback customer lookup logic for metadata edge cases

</details>

---

## 📸 Screenshots

> Replace with real project screenshots after deployment.

| Dashboard                   | AI Generation                  | Resume Preview            |
| --------------------------- | ------------------------------ | ------------------------- |
| ![](./assets/dashboard.png) | ![](./assets/ai-generator.png) | ![](./assets/preview.png) |

---

## 🛠 Tech Stack

| Category       | Technology                                                 |
| -------------- | ---------------------------------------------------------- |
| Framework      | Next.js 15 (App Router, Server Components, Server Actions) |
| Language       | TypeScript                                                 |
| UI             | Tailwind CSS v4, shadcn/ui, Framer Motion                  |
| State & Forms  | Zustand, React Hook Form, Zod                              |
| Database       | PostgreSQL, Prisma ORM                                     |
| Authentication | Clerk                                                      |
| Payments       | Stripe                                                     |
| AI             | Google Gemini                                              |
| Utilities      | DnD Kit, date-fns                                          |

---

## 🏗 Architecture

```text
Frontend (React / Next.js App Router)
        |
Server Actions + API Routes
        |
     Prisma ORM
        |
    PostgreSQL DB

External Services
- Clerk Authentication
- Stripe Billing
- Gemini AI
- Vercel Blob Storage
```

---

## ⚙ Engineering Challenges Solved

### Idempotent Stripe Webhooks

Handled duplicate webhook events safely using upsert-based subscription synchronization.

### Efficient Autosave System

Prevented excessive database writes using debounced dirty-state comparisons.

### Permission-Based Feature Gating

Implemented access controls across both client and server to prevent unauthorized premium feature use.

---

## 💻 Getting Started

### Prerequisites

* Node.js 18+
* PostgreSQL database
* Clerk account
* Stripe account
* Google AI Studio API key

### Clone Repository

```bash
git clone https://github.com/yourusername/ai-resume-builder.git
cd ai-resume-builder
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `.env`:

```env
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=

GEMINI_API_KEY=

BLOB_READ_WRITE_TOKEN=
```

### Initialize Database

```bash
npx prisma db push
npx prisma generate
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔭 Future Improvements

* Multi-template resume themes
* Resume scoring and ATS diagnostics
* Collaborative resume reviews
* AI cover letter generation
* Internationalization support (i18n)

---

## 👨‍💻 Author
Tran Thai Son

Information Technology Student

Interested in Full-Stack Development, System Architecture, and Scalable Web Applications

🔗 GitHub
https://github.com/thaison0401

---

##⭐ Support
If you like this project, consider giving it a star ⭐ on GitHub.
