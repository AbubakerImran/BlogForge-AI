# 🚀 BlogForge AI

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)

**AI-Powered Blog & Content Platform** built with Next.js 14, featuring AI-generated summaries, full SEO optimization, analytics dashboard, and a modern magazine-style design.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Models](#️-database-models)
- [Key Pages & Routes](#-key-pages--routes)
- [API Routes](#-api-routes)
- [Deployment](#-deployment)
- [Testing & Verification](#-testing--verification)
- [Troubleshooting](#️-troubleshooting)
- [Performance Optimizations](#-performance-optimizations)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

### Content Management
- 📝 **Rich Text Editor** — Tiptap-powered editor with full formatting toolbar (headings, bold, italic, lists, links, images)
- 🤖 **AI Summaries** — One-click AI-generated TLDR using Groq API (LLaMA 3.3 70B model), automatically saved with posts
- 🖼️ **Dynamic Image Hosting** — Supports images from any domain without configuration
- 📊 **Drafts & Publishing** — Save drafts and publish when ready
- 🏷️ **Categories & Tags** — Organize content with multiple taxonomies
- 📖 **Read Time Calculation** — Automatic reading time estimation

### SEO & Discovery
- 🔍 **SEO Optimized** — Dynamic meta tags, Open Graph, Twitter Cards, configurable via environment variables
- 🗺️ **Auto-generated Sitemap** — Dynamic XML sitemap for search engines
- 🏗️ **Structured Data** — JSON-LD schema markup for rich results
- 🔎 **Full-Text Search** — Search posts by title, content, and excerpt
- 📱 **Social Sharing** — Share buttons for Twitter, Facebook, LinkedIn, Reddit
- ⚙️ **Dynamic Configuration** — Site name, description, author, and URL configurable via env variables

### Analytics & Insights
- 📊 **Analytics Dashboard** — Page views, top posts, traffic sources, device breakdown
- 📈 **KPI Cards** — Total posts, views, subscribers, estimated revenue
- 📉 **Charts & Graphs** — Interactive visualizations with Recharts
- 👁️ **View Tracking** — Automatic page view and post view tracking
- 🌍 **Referrer & Device Data** — Traffic source and device analytics

### User Experience
- 🌙 **Dark Mode** — Full dark/light theme support across every page
- 📱 **Fully Responsive** — Mobile-first design with Tailwind CSS
- ⚡ **Fast Performance** — Optimized with Next.js 14 App Router
- 🎨 **Modern UI** — Beautiful components with shadcn/ui
- 📰 **Magazine Layout** — Professional blog/magazine design
- 🔖 **Table of Contents** — Auto-generated TOC for blog posts

### Authentication & Security
- 🔐 **Multiple Auth Methods** — Google OAuth + email/password via NextAuth.js
- 👤 **Role-Based Access** — USER and ADMIN roles with protected routes
- 🔒 **Secure Passwords** — Bcrypt hashing for credentials
- 🛡️ **Session Management** — Secure session handling with NextAuth
- 🚪 **Dashboard Logout** — User profile dropdown with sign out, accessible from sidebar and settings

### Marketing & Monetization
- 📰 **Newsletter** — Email subscription with Resend integration and automatic contact syncing
- 💰 **Ad Placeholders** — AdSense-ready placeholder components
- 📧 **Configurable Email** — Customizable sender name, email, and Resend audience integration
- 📤 **CSV Export** — Export subscriber list for email campaigns

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=flat-square&logo=postgresql)
![Groq](https://img.shields.io/badge/Groq-LLaMA--3.3-f55036?style=flat-square)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v4 (Google OAuth + Credentials) |
| AI | Groq API (LLaMA 3.3 70B) |
| Editor | Tiptap Rich Text Editor |
| Charts | Recharts |
| Email | Resend |
| Icons | Lucide React |

---

## ⚡ Quick Start

**Get up and running in 5 minutes:**

```bash
# 1. Clone and install
git clone https://github.com/AbubakerImran/BlogForge-AI.git
cd BlogForge-AI
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your credentials

# 3. Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Start development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) and sign in with:
- **Email:** admin@blogforge.ai
- **Password:** admin123

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), or local PostgreSQL)
- Google OAuth credentials (for Google sign-in) - [Get here](https://console.cloud.google.com/)
- Groq API key (for AI summaries) - [Get here](https://console.groq.com)
- Resend API key (optional, for newsletter emails) - [Get here](https://resend.com)

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

   | Variable | Required | Description | Example |
   |----------|----------|-------------|---------|
   | `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
   | `NEXTAUTH_SECRET` | ✅ | Random secret for session encryption | Run: `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | ✅ | App URL for OAuth callbacks | `http://localhost:3000` |
   | `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID | From Google Cloud Console |
   | `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret | From Google Cloud Console |
   | `GROQ_API_KEY` | ✅ | Groq API key for AI summaries | From console.groq.com |
   | `RESEND_API_KEY` | ⚠️ | Resend API key for newsletter | Optional - from resend.com |
   | `RESEND_FROM_NAME` | ⚠️ | Sender display name for emails | `BlogForge` |
   | `RESEND_FROM_EMAIL` | ⚠️ | Sender email address | `noreply@yourdomain.com` |
   | `RESEND_AUDIENCE_ID` | ⚠️ | Resend audience ID for contacts | From Resend dashboard |
   | `NEXT_PUBLIC_SITE_NAME` | ⚠️ | Site name for SEO and branding | `BlogForge AI` |
   | `NEXT_PUBLIC_SITE_DESCRIPTION` | ⚠️ | Site description for SEO meta tags | `An AI-powered blogging platform` |
   | `NEXT_PUBLIC_APP_URL` | ⚠️ | Public site URL for SEO and sitemap | `https://yourdomain.com` |
   | `NEXT_PUBLIC_SITE_AUTHOR` | ⚠️ | Default author name | `BlogForge AI Team` |

   **Getting API Keys:**
   - **Google OAuth:** [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → Create OAuth 2.0 Client ID
   - **Groq API:** [Groq Console](https://console.groq.com) → API Keys → Create API Key (free tier available)
   - **Resend:** [Resend Dashboard](https://resend.com/api-keys) → API Keys → Create API Key

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

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on `http://localhost:3000` |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma db seed` | Seed database with sample data |

### Development Workflow

1. **Make code changes** in `src/` directory
2. **Hot reload** automatically updates the browser
3. **Check for errors** in the terminal and browser console
4. **Test your changes** locally before committing
5. **Run linter** with `npm run lint` before pushing

### Prisma Studio

Access your database with a visual editor:
```bash
npx prisma studio
```
Opens at `http://localhost:5555` with full CRUD interface for all models.

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

## 🗄️ Database Models

The application uses Prisma ORM with PostgreSQL. Key models:

| Model | Description | Key Fields |
|-------|-------------|------------|
| **User** | User accounts with role-based access | email, password, role (USER/ADMIN) |
| **Post** | Blog posts with rich content | title, slug, content, aiSummary, published, views |
| **Category** | Post categories | name, slug, color, description |
| **Tag** | Post tags for organization | name, slug |
| **Newsletter** | Email subscribers | email, active |
| **PageView** | Analytics tracking | page, referrer, device, country |
| **Account** | OAuth provider accounts | provider, providerAccountId |
| **Session** | User sessions | sessionToken, expires |

**Relationships:**
- User → Post (one-to-many, author relationship)
- Category → Post (one-to-many)
- Tag ↔ Post (many-to-many)

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import repository on [Vercel](https://vercel.com)**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Configure environment variables**
   Add all variables from `.env` in Vercel project settings:
   - Go to Project Settings → Environment Variables
   - Add each variable from your `.env` file
   - Make sure `NEXTAUTH_URL` matches your Vercel domain

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys your app

5. **Set up database**
   After first deployment, run migrations:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Run Prisma commands on Vercel
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

### Build Command
```bash
npm run build
```

### Alternative Deployment Options

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Other Platforms:**
- **Netlify:** Supports Next.js with build command `npm run build`
- **Railway:** One-click PostgreSQL + Next.js deployment
- **DigitalOcean App Platform:** Supports Next.js deployments

---

## 📸 Screenshots

> Add screenshots of the homepage, blog post page, and dashboard here.

---

## 🎯 Key Pages & Routes

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Magazine-style homepage with featured posts |
| Blog List | `/blog` | Paginated blog post listing |
| Blog Post | `/blog/[slug]` | Individual post with TOC, share, AI summary |
| Category | `/category/[slug]` | Posts filtered by category |
| Tag | `/tag/[slug]` | Posts filtered by tag |
| Search | `/search` | Full-text search results |
| Dashboard | `/dashboard` | Admin overview with KPI cards |
| Analytics | `/dashboard/analytics` | Traffic charts and insights |
| Post Editor | `/dashboard/posts/new` | Rich text post editor |
| Manage Posts | `/dashboard/posts` | All posts table with actions |
| Categories | `/dashboard/categories` | Category management |
| Newsletter | `/dashboard/newsletter` | Subscriber list and export |
| Settings | `/dashboard/settings` | Profile settings |
| Sign In | `/auth/signin` | Google OAuth + email/password |
| Sign Up | `/auth/signup` | New user registration |

---

## 🔌 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/posts` | GET, POST | List/create posts |
| `/api/posts/[id]` | GET, PUT, DELETE | Get/update/delete post |
| `/api/ai/summarize` | POST | Generate AI summary with Groq |
| `/api/analytics` | GET | Fetch analytics data |
| `/api/analytics/track` | POST | Track page views |
| `/api/search` | GET | Search posts |
| `/api/categories` | GET, POST | Manage categories |
| `/api/tags` | GET, POST | Manage tags |
| `/api/newsletter` | POST | Subscribe to newsletter |
| `/api/sitemap` | GET | Dynamic XML sitemap |

---

## 🧪 Testing & Verification

### Run Linter
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```
**Note:** Build may show database errors if `.env` is not configured. This is expected behavior — the app compiles successfully, but pages requiring database access cannot be pre-rendered without valid credentials.

### Start Production Server
```bash
npm run start
```

---

## 🛠️ Troubleshooting

### Common Issues

**1. `PrismaClientInitializationError: Environment variable not found: DATABASE_URL`**
- **Solution:** Ensure `.env` file exists with valid `DATABASE_URL`
- Run `cp .env.example .env` and update with your database credentials

**2. Build succeeds but pages fail to pre-render**
- **Cause:** Next.js tries to pre-render pages at build time, but database isn't accessible
- **Solution:** This is expected for dynamic data. The app will work correctly at runtime.

**3. Google OAuth not working**
- **Solution:** Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Ensure authorized redirect URI is set in Google Cloud Console: `http://localhost:3000/api/auth/callback/google`

**4. AI Summary generation fails**
- **Solution:** Check `GROQ_API_KEY` in `.env`
- Get a free API key from [Groq Console](https://console.groq.com)

**5. Newsletter subscription not sending emails**
- **Solution:** Add valid `RESEND_API_KEY` to `.env`
- Configure `RESEND_FROM_NAME` and `RESEND_FROM_EMAIL` for custom sender info
- Optionally set `RESEND_AUDIENCE_ID` to sync subscribers to Resend contacts
- Get API key from [Resend](https://resend.com)

**6. Images from external domains not loading**
- **Solution:** The app now supports images from any domain automatically via `remotePatterns` in `next.config.js`

**7. Site title and description not updating**
- **Solution:** Set `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_DESCRIPTION`, `NEXT_PUBLIC_APP_URL`, and `NEXT_PUBLIC_SITE_AUTHOR` environment variables for SEO-friendly dynamic configuration

---

## 🚀 Performance Optimizations

- ⚡ **Static Generation** for public pages (home, about, contact)
- 🔄 **Incremental Static Regeneration (ISR)** for blog posts
- 🖼️ **Next.js Image Optimization** with dynamic remote patterns for any domain
- 📦 **Code Splitting** via Next.js App Router
- 🎨 **CSS Optimization** with Tailwind CSS JIT compiler
- 🗄️ **Database Indexing** on slug, email, and foreign keys

---

## 🔐 Security Features

- 🔒 **NextAuth.js** for secure authentication
- 🛡️ **Bcrypt** password hashing
- 🚫 **CSRF Protection** via NextAuth
- 🔑 **Environment Variables** for sensitive data
- 👤 **Role-Based Access Control** (USER, ADMIN)
- 🧹 **Input Validation** with Zod schemas

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows the existing style (use `npm run lint`)
- All pages render without errors
- Environment variables are documented in `.env.example`

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Tiptap](https://tiptap.dev/) - Headless editor
- [Prisma](https://www.prisma.io/) - Next-gen ORM
- [Groq](https://groq.com/) - AI inference
- [Recharts](https://recharts.org/) - Charting library

---

## 👤 Author

**Abubaker Imran**

- GitHub: [@AbubakerImran](https://github.com/AbubakerImran)

---

## 📞 Support

If you encounter any issues or have questions:
- Open an [Issue](https://github.com/AbubakerImran/BlogForge-AI/issues)
- Check existing issues for solutions
- Review the troubleshooting section above

---

**⭐ Star this repo if you find it helpful!**