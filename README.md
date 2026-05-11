# pill.finance — Next.js implementation

This is the Next.js SSG implementation of the URL architecture locked in `../docs/11-url-architecture.md`. It supersedes the static `../index.html` once cutover happens (per `../docs/12-nextjs-migration-plan.md`).

## Quick start (Selim)

Open PowerShell here and run:

```powershell
cd "C:\Users\Selim ONAY\Documents\Claude\Projects\pill.finance\nextjs"
npm install
npm run dev
```

Visit http://localhost:3000 — should show the homepage with placeholder data for all 19 assets.

## Structure (current state, Phase 1)

```
nextjs/
├── app/
│   ├── layout.tsx                 Site-wide layout (header, ticker, footer)
│   ├── page.tsx                   Homepage (/)
│   └── globals.css                All CSS (ported from index.html)
├── components/
│   ├── Header.tsx
│   ├── TickerTape.tsx
│   ├── Footer.tsx
│   ├── AssetCard.tsx
│   └── CategoryBlock.tsx
├── lib/
│   ├── slugs.ts                   Single source of truth for 19 assets
│   ├── briefings.ts               Typed JSON readers
│   └── types.ts                   Shared TypeScript types
├── data/
│   └── briefings/
│       ├── latest.json            Pointer to latest day file
│       └── 2026-05-04.json        Sample per-day file (placeholder content)
├── public/                        (static assets)
├── package.json
├── tsconfig.json
├── next.config.js
└── next-env.d.ts
```

## What's NOT here yet (Phase 2+)

- `/asset/[slug]` and `/asset/[slug]/[date]` routes
- `/digest`, `/markets`, `/learn`, `/compare` namespaces
- Sitemap routes
- Schema.org JSON-LD generators
- OG image generation
- API routes

See `../docs/12-nextjs-migration-plan.md` for the full Phase plan.

## Build verification

After `npm install`, run:

```powershell
npm run type-check    # Verify TypeScript compiles
npm run build         # Verify SSG builds the homepage
npm run dev           # Local dev server
```

If `npm run build` succeeds, Phase 1 is verified. The build output should mention "○ /" as a static page.
