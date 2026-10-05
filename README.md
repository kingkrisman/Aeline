# Aeline — environmental non-profit landing page

React + TypeScript + Vite, Tailwind v4, Motion, Lenis.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle
npm run preview
```

## Structure

```
src/
  App.tsx                  page composition, scroll progress, video modal state
  index.css                design tokens (@theme), keyframes, reduced-motion rules
  lib/
    data.ts                all copy + image ids — edit content here, not in components
    motion.ts              shared curves, springs, reveal variants
    hooks.ts               smooth scroll, scroll lock, count-up, magnetic, pointer
  components/
    Navbar / Hero / Mission / TrustedBy / Initiatives / Newsletter / Footer / VideoModal
    ui/  Reveal, Button, TiltCard, Img, Cursor, Icons
```

Content lives in [src/lib/data.ts](src/lib/data.ts). Swapping copy, stats, nav items, or
photos does not require touching a component.

## Design tokens

Colours and easing curves are declared once in `@theme` in
[src/index.css](src/index.css), so they are available as Tailwind utilities
(`bg-moss`, `text-forest`, `ease-out`). `--ease-out` deliberately overrides
Tailwind's built-in `ease-out` with `cubic-bezier(0.23, 1, 0.32, 1)` — the
built-in curves are too weak to read as intentional at these durations.

## Motion

Every curve and duration comes from [src/lib/motion.ts](src/lib/motion.ts) or the
`@theme` block. Nothing is hand-rolled per component.

| Where | What | Ingredients |
| --- | --- | --- |
| Hero headline | Lines ride up from behind their own clip box | transform, 900ms `ease-out`, 90ms stagger |
| Hero image | `clip-path` wipe on load, then scroll parallax | clip-path + transform, spring-smoothed scroll |
| Floating cards | Entrance stagger, then a slow idle float | CSS animation (off main thread) |
| Cards / pillars | Pointer tilt with a tracking glare | springs — the pointer can reverse mid-motion |
| Stats | Count up once on first view | 1.7s `ease-out`, fires once |
| Buttons | Magnetic pull + press feedback | spring; `scale(0.97)` at 160ms |
| Sections | Reveal on scroll, once, never replayed | transform + opacity, or `clip-path` for image cards |
| Logo strip | Continuous marquee | CSS animation, `linear` |
| Carousel | Drag with flick projection and snap | spring, velocity-projected target |
| Modal / menu | Scale-and-fade / slide | 250ms `ease-out`, backdrop shares timing |

Only `transform`, `opacity`, and `clip-path` are animated — never `width`,
`height`, `padding`, or `top`/`left`, which force layout every frame.

## Accessibility

- `prefers-reduced-motion` is honoured throughout: transform-based motion and
  looping decoration are dropped, opacity transitions are kept, and Lenis smooth
  scrolling is disabled entirely rather than hijacking the scroll.
- Hover-driven motion is gated behind `(hover: hover) and (pointer: fine)` so
  taps don't fire phantom hover states.
- Modal and mobile menu close on `Escape`, lock body scroll, move focus to the
  close button, and restore it on close. Backdrops are click targets only and
  stay out of the accessibility tree.
- Skip link, visible focus rings, labelled icon buttons.

## Notes

- **Node:** Vite 7 expects Node 20.19+ or 22.12+. This project was built and
  verified on Node 22.11, which prints an engine warning but works. Note that
  npm *silently skips optional dependencies whose `engines` don't match* — that
  is what breaks native bundler bindings on an older Node, so if a fresh
  `npm install` leaves the bundler unable to start, upgrade Node first.
- Photography is loaded from Unsplash at runtime. `Img` renders a tinted
  gradient placeholder, blurs up on load, and falls back to that gradient if a
  request fails, so a broken image never leaves a hole in the layout.
