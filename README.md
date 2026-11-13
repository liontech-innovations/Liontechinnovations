# LionTech Innovations Corporate Website

Vite, React and TypeScript website for Lion Tech Innovations Ltd. The primary commercial positioning is AI Business Readiness, led by the AI Visibility Snapshot.

## Development documentation

**Superpowers is LionTech's primary development framework.** All coding agents must start with [AGENTS.md](AGENTS.md) and the [central agent skills registry](docs/AGENT_SKILLS.md), then use the applicable skills through their own [officially supported Superpowers integration](https://github.com/obra/superpowers#installation). Each agent requires an independently verified global installation; repository documentation does not install or activate it.

Existing [architecture](docs/ARCHITECTURE.md), [design](DESIGN.md), [Founder lock](docs/FOUNDER_LOCK_V1.1.md), [content governance](docs/AI_FIRST_CONTENT_GOVERNANCE.md) and [release controls](docs/RELEASE_READY_CHECKLIST.md) remain in force. Never merge, deploy or modify production without explicit Founder authorisation.

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
