# SUPERPOWERS — PRIMARY DEVELOPMENT FRAMEWORK

Superpowers is LionTech's primary development framework. All participating coding agents, including Codex, Claude, Hermes and other supported agents, must discover and use the applicable officially supported Superpowers skills when working on LionTech software projects.

Start with the [central agent skills registry](docs/AGENT_SKILLS.md). Each agent environment requires its own global installation and independent verification using the [official integration instructions](https://github.com/obra/superpowers#installation). This document does not install a plugin, activate skills or prove installation in any environment. Report a missing or unverified integration accurately; do not invent activation settings or bypass safeguards.

## Mandatory development principles

1. **PLAN:** Establish requirements and an implementation approach before substantial changes. Follow the applicable Superpowers planning and approval workflow.
2. **BUILD:** Implement the authorised solution with the applicable skills. Delegate independent tasks when beneficial and supported, with clear ownership and bounded scope.
3. **TEST:** Use test-driven development where applicable. Run relevant automated tests and validate functionality; debug failures systematically.
4. **REVIEW:** Review code quality, security, regressions and adherence to requirements before integration.
5. **VERIFY:** Require execution evidence before claiming successful completion. Distinguish observed results, assumptions and checks that were not run.
6. **DELIVER:** Report changes, files touched, verification commands and results, remaining risks and the next action.

Use the lightest workflow supported by the installed framework for small, low-risk tasks without bypassing mandatory checks. Preserve existing project architecture, instructions and locked business decisions. Superpowers supplements these controls; it does not grant permission to change production or waive release gates.

## Repository controls

- Inspect the relevant code and instructions before editing. Prefer small, reversible changes and existing conventions.
- Read [architecture](docs/ARCHITECTURE.md), [design](DESIGN.md), [Founder lock](docs/FOUNDER_LOCK_V1.1.md) and the [release checklist](docs/RELEASE_READY_CHECKLIST.md) as applicable. Content work must also follow [content governance](docs/AI_FIRST_CONTENT_GOVERNANCE.md).
- Preserve public URLs, SEO behaviour, branding, prices, legal positioning, payment flows and production schemas unless the requested scope explicitly authorises those changes.
- Never expose or commit credentials, tokens, private keys, live environment files, sessions or private databases. Inspect the diff and staged files and scan for secrets before committing or pushing.
- This repository uses Vite, React, TypeScript and npm. See the [README checks](README.md#checks) and relevant `package.json` scripts; choose verification appropriate to the change and state anything not run.
- **Never merge, deploy or modify production without explicit Founder authorisation.** Existing release and security gates remain in force. Permission to edit or push a feature branch is not permission to merge or deploy it.

## Agent discovery and scope

Agents that read `AGENTS.md` should load this directive at repository entry. Claude and GitHub Copilot have companion entry files that point here. Other supported agents must use their documented repository-instruction mechanism to load this file and the registry.

The policy applies to all LionTech software development projects, but a file in this repository is not automatically visible in another checkout. Each other project or agent's supported global instructions must explicitly reference the central directive while preserving that project's own controls. Verify both instruction discovery and the separate Superpowers integration in a fresh session; do not infer either from this document's existence.
