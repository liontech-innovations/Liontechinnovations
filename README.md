# LionTech Innovations Corporate Website

Vite, React and TypeScript website for Lion Tech Innovations Ltd. The primary commercial positioning is AI Business Readiness, led by the AI Visibility Snapshot.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and supply only the server-side values required for the API flows you are testing.
3. Run `npm run dev`.

## Checks

- `npm run lint`: TypeScript no-emit check
- `npm run build`: production Vite build
- `npm run preview`: serve the production build locally

## Environment boundaries

Private API keys must never use a `VITE_` prefix and must never be injected in `vite.config.ts`. `VITE_AI_SNAPSHOT_CTA_URL` is intentionally public. When it is absent, Snapshot calls to action route to the on-site enquiry form.

## Release gate

Feature work is preview-only until FREEJOY approves the visual result, Customer Zero validates fulfilment, checkout or booking is approved, and technical and security checks pass. Do not merge or deploy production without explicit Founder approval.
