## Axios Innovations Site Migration Plan

### Goals
- Serve the marketing site via Next.js 14 (App Router) for Vercel-native deployment.
- Deliver cinematic motion with React Three Fiber, drei helpers, and GSAP-powered parallax sections.
- Standardize backend on Neon (or any PostgreSQL) using SQL migrations managed in `db/migrations`.
- Remove legacy Vite/Supabase artifacts so the project reflects the new stack end-to-end.

### Remaining Tasks
1. **Motion stack audit**
   - Verify `@gsap/react` usage matches the v2 API (hooks replaced class components).
   - Upgrade `three-mesh-bvh` to the compatible 0.8.x release to silence npm deprecation notices.
2. **Database layer**
   - Confirm API routes and `lib/subscriptionService.ts` exclusively use Neon/Postgres clients.
   - Expand migration docs with connection instructions for Neon and self-hosted Postgres.
3. **CI + quality gates**
   - Add a GitHub Action running `npm install`, `npm run check:deprecated`, `npm run lint`, and `npm run build`.
   - Document how to resolve deprecated dependency failures.
4. **Documentation refresh**
   - Update README sections (Motion, Database, Deployment) to call out the Next.js + Neon architecture.
   - Add environment variable guidance for production vs. preview deployments.

### Nice-to-haves
- Create Storybook (Next.js mode) for interactive previews of GSAP/Three components.
- Add visual regression tests (Chromatic or Playwright) to catch animation regressions before deploy.
- Provide a simple seed script for Neon so demo data exists in staging.

This plan should be kept alongside the repo and updated as we complete each milestone.

