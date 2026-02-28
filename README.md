# 🚀 BlogForge AI

**AI-Powered Blog & Content Platform** built with Next.js 14, featuring AI-generated summaries, full SEO optimization, analytics dashboard, and a modern magazine-style design.

---

## ✨ Features

- 📝 **Rich Text Editor** — Tiptap-powered editor with full formatting toolbar
- 🤖 **AI Summaries** — One-click AI-generated TLDR using OpenAI GPT-3.5
- 🔍 **SEO Optimized** — Dynamic meta tags, Open Graph, JSON-LD structured data, auto-generated sitemap
- 📊 **Analytics Dashboard** — Page views, top posts, traffic sources, device breakdown with Recharts
- 🌙 **Dark Mode** — Full dark/light theme support across every page
- 🔐 **Authentication** — Google OAuth + email/password via NextAuth.js
- 📰 **Newsletter** — Email subscription with Resend integration
- 📱 **Fully Responsive** — Mobile-first design with Tailwind CSS
- 🏷️ **Categories & Tags** — Organized content with filtered views
- 💰 **Ad Placeholders** — AdSense-ready placeholder components
- 📈 **KPI Cards** — Total posts, views, subscribers, estimated revenue
- 🔎 **Full-Text Search** — Search posts by title, content, and excerpt

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=flat-square&logo=postgresql)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=flat-square&logo=openai)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v4 (Google OAuth + Credentials) |
| AI | OpenAI API (GPT-3.5-turbo) |
| Editor | Tiptap Rich Text Editor |
| Charts | Recharts |
| Email | Resend |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (e.g., [Neon](https://neon.tech))
- Google OAuth credentials (for Google sign-in)
- OpenAI API key (for AI summaries)
- Resend API key (optional, for newsletter emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbubakerImran/BlogForge-AI.git
   cd BlogForge-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials:

   | Variable | Description |
   |----------|-------------|
   | `DATABASE_URL` | PostgreSQL connection string |
   | `NEXTAUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | App URL (`http://localhost:3000`) |
   | `GOOGLE_CLIENT_ID` | Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
   | `OPENAI_API_KEY` | OpenAI API key |
   | `RESEND_API_KEY` | Resend API key (optional) |

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database**
   ```bash
   npx prisma db seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Login
- **Email:** admin@blogforge.ai
- **Password:** admin123

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Sign in / Sign up pages
│   ├── blog/              # Blog listing and post pages
│   ├── dashboard/         # Admin dashboard
│   ├── category/          # Category filtered views
│   ├── tag/               # Tag filtered views
│   └── ...                # About, Contact, Privacy, Terms
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Navbar, Footer, Sidebar
│   ├── blog/              # Post cards, TOC, share buttons
│   ├── dashboard/         # KPI cards, charts, tables
│   ├── forms/             # Post editor, newsletter, contact
│   └── shared/            # Theme provider, pagination, etc.
├── lib/                   # Utilities, Prisma, auth config
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript type definitions
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy — Vercel auto-detects Next.js

```bash
npm run build
```

---

## 📸 Screenshots

> Add screenshots of the homepage, blog post page, and dashboard here.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Abubaker Imran**

- GitHub: [@AbubakerImran](https://github.com/AbubakerImran)