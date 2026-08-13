# Visual QA

Date: 13 August 2026

## Design-source review

- Taste settings: design variance 7, motion intensity 4, visual density 4.
- Primary Refero source: [Mercury, alpine banking at blue hour](https://styles.refero.design/style/3172cd4d-118a-4a16-a259-6b634d32322e).
- Secondary Refero source: [Joby Aviation, golden-hour cockpit](https://styles.refero.design/style/c1052d8d-3663-46a4-a882-e50d9b8a1166).
- The implementation applies their cinematic full-bleed media, restrained controls, measured hierarchy and single-accent discipline without copying branded assets or layout.

## Taste preflight

| Check | Result | Evidence |
|---|---|---|
| Hero reads as a real authority site, not an AI dashboard | PASS | Approved city video, HTML headline and CTA; no score or generated interface |
| LionTech visual identity preserved | PASS | Navy canvas, muted gold action colour and existing logo |
| One dominant accent | PASS | Gold is reserved for conversion and restrained emphasis |
| Card-grid overload avoided | PASS | Editorial scene changes; cards limited to real content units |
| Heading hierarchy | PASS | All nine marketing routes have one H1 and no heading-level jumps |
| Mobile stacking | PASS | Single-column layouts at narrow breakpoints; no horizontal overflow |
| Hero CTA visibility | PASS | Visible at every tested viewport from 360×800 through 1920×1080 |
| Reduced motion | PASS | Video pauses and resets; poster remains visible; non-essential transitions disabled |
| Focus and keyboard access | PASS | Skip link, labelled controls, visible focus treatments and accessible mobile disclosure |
| Prohibited visual patterns | PASS | No purple AI gradient, glowing brain, marquee, parallax, decorative status dots or public readiness score |

## Responsive matrix

Tested viewport sizes:

- 360×800
- 375×812
- 390×844
- 430×932
- 768×1024
- 1366×768
- 1440×900
- 1920×1080

Every viewport reported zero horizontal overflow and a visible primary hero action. The Founder-locked headline wraps to five lines on narrow mobile and three to four lines on larger layouts; this is an intentional content-first trade-off.

## Browser verification

- All 18 React routes: meaningful body content, expected title and H1, no Vite overlay, no console error.
- All nine new marketing routes: one `main`, one H1, skip link present, no missing image alt text, no unnamed controls and no empty links.
- Enquiry form: seven named required controls, visible consent language and Privacy Policy link.
- Hero: supplied WebM reaches ready state 4; MP4 and poster are present as fallbacks.
- Mobile menu: disclosure control is named and keyboard operable.

## Evidence files

- `docs/qa/final-home-desktop.png`
- `docs/qa/final-home-mobile.png`
- `docs/qa/final-contact-mobile.png`
- `docs/qa/baseline-*.png`
- `docs/qa/refero-primary-mercury.png`
- `docs/qa/refero-secondary-joby-aviation.png`
