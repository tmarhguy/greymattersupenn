# Penn Grey Matters

A neuroscience publication at the University of Pennsylvania. Built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Three.js.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app/` — Next.js App Router pages
- `components/` — React components (Hero, Nav, Articles, etc.)
- `data/` — Static JSON (brain-regions, brain-pathways, chapters)
- `lib/` — Utilities, Sanity client
- `sanity/` — Sanity schema definitions (for CMS setup)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity CMS
- `RESEND_API_KEY` — For contact form and newsletter
- `EDITORIAL_EMAIL` — Where contact form submissions go

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with scroll story |
| `/articles` | Article archive |
| `/explore` | Grey Matter — interactive brain explorer |
| `/podcast` | Grey Frequencies podcast |
| `/chapters` | Grey Matters chapters worldwide |
| `/about` | Purpose, Scope, Commitment |
| `/get-involved` | Join form |
| `/contact` | Contact form |

## Next Steps

1. **Sanity Studio** — Set up Sanity v3 and add schema. Content from `old-website-data/` should be manually entered.
2. **3D Assets** — Add `public/animations/neuron-hero.glb` and `brain-atlas.glb` for Hero and Grey Matter.
3. **Logo** — `public/main-image.png` is used for favicon and preloader.
4. **Lenis** — Integrate `@studio-freight/lenis` (or `lenis`) for smooth scroll.

## Content Migration

Content from `old-website-data/` (Purpose, Scope, Commitment, Articles, Chapters, Team) should be manually entered into Sanity. Do not automate.
