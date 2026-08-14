# LionTech AI Business Readiness Design System

## Design read

Controlled corporate redesign for UK SME owners. The visual language is cinematic, real-world, active and technically serious. The existing LionTech navy and muted gold identity remains the source of truth.

Taste configuration:

- `DESIGN_VARIANCE: 7`
- `MOTION_INTENSITY: 4`
- `VISUAL_DENSITY: 4`
- Redesign mode: preserve brand and production routes, overhaul the commercial homepage narrative

## Refero sources

Primary reference:

- [Mercury: Alpine banking at blue hour](https://styles.refero.design/style/3172cd4d-118a-4a16-a259-6b634d32322e)
- Selected for its measured dark-canvas hierarchy, intermediate heading weight, single-accent conversion discipline, full-bleed photography and low-shadow surfaces.

Secondary reference:

- [Joby Aviation: Golden hour cockpit](https://styles.refero.design/style/c1052d8d-3663-46a4-a882-e50d9b8a1166)
- Selected for its real-world motion, full-bleed cinematic media, restrained interface and ability to let photography carry the emotional narrative.

Only principles are used. No trademarks, proprietary graphics, copy, branded layouts or reference-specific colours are reproduced.

## Palette

| Token | Value | Role |
|---|---:|---|
| Canvas | `#06111f` | Main LionTech navy background |
| Deep canvas | `#030a14` | Hero fallback, header and footer |
| Surface | `#0b1a2b` | Quiet section lift |
| High surface | `#102238` | Editorial scene change |
| Primary text | `#eef1f3` | Headings and high-priority text |
| Muted text | `#a8b4bf` | Supporting copy |
| LionTech gold | `#c8a24a` | Primary conversion action |
| Light gold | `#e0bf6d` | Links and restrained emphasis |

Gold is the only chromatic accent. It is functional, not decorative. No purple, violet, neon or multi-accent gradients.

## Typography

- Font stack: `Avenir Next`, `Segoe UI`, system sans-serif.
- No remote font request is required.
- Display headings use weight 500, tight tracking and balanced wrapping.
- Body copy uses 16-20px with 1.5-1.6 line height.
- Hero headline uses responsive 51-98px sizing and is allowed to wrap naturally because the Founder-locked message takes priority over a one-line treatment.

## Layout and spacing

- Content width: 1240px maximum.
- Base horizontal gutter: 24px desktop, 16px mobile.
- Major section rhythm: 88-144px.
- Large editorial scenes replace repeated equal card rows.
- Cards are reserved for real content units such as owned platform previews and the enquiry form.
- Mobile layouts collapse to a strict single column below 768px.

## Shape system

- Buttons: full pill radius.
- Content cards and inputs: 8-14px radius.
- Circular geometry is reserved for the Company Brain symbol and menu control.
- No drop-shadow hierarchy on marketing content. Surface contrast and borders provide structure.

## Hero media

- Exact supplied WebM, MP4 and poster only.
- WebM first, MP4 fallback.
- Poster is preloaded and used for blocked autoplay, reduced motion and first paint.
- Video uses `object-fit: cover`; desktop centres the supplied composition, while mobile shifts to 58% horizontal focus.
- A navy left-to-right scrim protects HTML copy without obscuring the city.

## Navigation and buttons

- Desktop header stays under 80px and uses one line.
- Mobile navigation is a full-height, keyboard-accessible disclosure.
- Primary action uses LionTech gold with dark text.
- Secondary action is a restrained ivory outline on navy.
- Visible focus rings use a translucent light-gold outline.

## Motion

- The hero video supplies the major motion.
- Hover and active states communicate interaction feedback only.
- No scroll hijacking, parallax, marquees, particles, cursor effects or perpetual animation.
- `prefers-reduced-motion` hides and pauses the video and removes non-essential transitions.

## Responsive rules

- Desktop copy remains in the dark left zone of the hero.
- Mobile strengthens the navy overlay and keeps the city visible behind the text.
- Buttons become full-width only when required for narrow screens.
- The Our Stack strip scrolls horizontally without autoplay.
- Platform cards become single-column below 640px.

## Prohibited patterns

- Fake dashboards or fake screenshots
- Invented 0-100 scores or before-and-after metrics
- Purple AI gradients or glowing brains
- Card-grid overload
- Autoplay logo carousels
- London location claims
- Generic stock-office imagery
- Scroll cues and decorative status dots
- Public prompt or AI-system counts before Customer Zero approval
