# Axios AI Innovations Website

Modern marketing + product hub for Axios AI Innovations, now rebuilt on a full-stack Next.js/Vercel architecture with cinematic motion powered by Three.js, React Three Fiber, GSAP, and parallax storytelling.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript 5.5
- **Styling**: Tailwind CSS 3.4 + Lucide icons
- **Motion/3D**: React Three Fiber, drei, GSAP + ScrollTrigger, custom parallax sections
- **Forms & Email**: EmailJS (client-side) + custom providers
- **Payments**: Stripe Checkout via Next.js route handlers
- **Database**: Neon (Postgres) driven through `@neondatabase/serverless`
- **Deployment**: Vercel (serverless + edge ready)

## Getting Started

```bash
npm install
cp env.example .env.local     # add real keys
npm run dev                   # http://localhost:3000
npm run lint                  # Next.js lint rules
npm run build                 # Production build
npm run check:deprecated      # verify no deprecated direct deps
```

> **Heads up:** Node.js 18+ is required. If `npm` isn’t available locally, install Node first so dependencies (Next.js, React Three Fiber, GSAP, etc.) resolve correctly.
>
> The `postinstall` hook now runs `npm run check:deprecated`. If direct dependencies go out of support, installs will fail until you bump them, preventing stale packages from sticking around.

## Environment Variables

Create `.env.local` (or edit the generated file) with:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Base URL used for Stripe success/cancel redirects |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID` | Email template for contact form |
| `NEXT_PUBLIC_EMAILJS_CUSTOM_PROJECT_TEMPLATE_ID` | Email template for custom projects |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for client interactions |
| `STRIPE_SECRET_KEY` | Secret key used by `/api/checkout` |
| `DATABASE_URL` | Neon/Railway Postgres connection string |

## Database & Migrations

1. Create a free Neon (or compatible Postgres) instance.
2. Copy the connection string into `DATABASE_URL`.
3. Run existing SQL migrations:

```bash
npm run db:migrate
```

This script uses `@neondatabase/serverless` to apply every file under `db/migrations`.

## API Routes

| Route | Method | Description |
| --- | --- | --- |
| `/api/subscribe` | `POST` | Writes early-access signups to Postgres (used by hero + contact CTAs) |
| `/api/checkout` | `POST` | Creates a Stripe Checkout session for custom project retainers |

Both routes are serverless-safe and emit structured JSON errors for the front end.

## Motion & Experience

- **Hero**: React Three Fiber canvas with animated orbs + neon gradients.
- **Services**: Replaces the old “products in works” grid with clear offers.
- **Parallax Showcase**: GSAP + ScrollTrigger animate case studies as you scroll.
- **NextStep**: Lives on its own Next.js route and keeps its payment + processing flow.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run `next lint` |
| `npm run db:migrate` | Apply SQL migrations to the configured Postgres |
| `npm run check:deprecated` | Fails when direct dependencies are deprecated |
| `npm run deploy` | Push to Vercel repository (triggers deployment) |
| `npm run push:all` | Push to both main and Vercel repositories |

## Deployment Notes

- Default deployment target is **Vercel**. Environment variables should be added to the Vercel project (remember to mark Stripe keys as encrypted secrets).
- If you need background jobs/webhooks (e.g., Stripe fulfillment), add another route under `app/api/*`.
- **Git Remotes**: This project uses two GitHub repositories:
  - `origin` → Main repository (`Axios-AI-Innovations/Axios-AI-Innovations`)
  - `vercel` → Vercel deployment repository (`Axios-AI-Innovations/axios_ai_innovations`)
- **Deployment Workflow**: After committing changes, use `npm run deploy` to push to Vercel, or `npm run push:all` to sync both repositories.

## Contact

For inquiries: `CEO@axiosaiinnovations.com`

## License

© 2025 Axios AI Innovations™ LLC. All rights reserved.
