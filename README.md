# The Everly — condo marketing site

A static marketing site for a condominium building, covering both **sales** and **leasing**.
Built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com), and set up
to deploy to **Cloudflare Pages**.

All copy and imagery in the repository is placeholder content, meant to be replaced.

---

## Requirements

Node.js `^18.20.8 || ^20.3.0 || >=22.0.0` (see `.nvmrc`).

Dependencies are already installed and the project has been built and verified against Node 22
(`astro check` reports 0 errors; `astro build` produces 6 pages). If `node` is not yet on your PATH,
install it from [nodejs.org](https://nodejs.org) or via `brew install node`, then:

```bash
npm run dev
```

The dev server runs at `http://localhost:4321`. If you move the project or hit any module errors,
`rm -rf node_modules && npm install` will rebuild the dependency tree.

| Command           | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                           |
| `npm run build`   | Production build to `dist/`                          |
| `npm run preview` | Serve the built site locally                         |
| `npm run check`   | Astro + TypeScript diagnostics                       |
| `npm run deploy`  | Build, then upload `dist/` to Cloudflare Pages       |

---

## Project structure

```
src/
├── assets/            Source images — optimized at build time by Astro + sharp
│   ├── gallery/       Gallery photography (10 placeholders)
│   ├── units/         One image per floor plan (plan-a … plan-e)
│   └── location/      Neighborhood imagery
├── components/
│   ├── AvailabilityGrid.astro   Filter bar + unit grid + sorting
│   ├── UnitCard.astro           A single residence card
│   ├── GalleryGrid.astro        Responsive gallery + lightbox
│   ├── Header.astro / Footer.astro
│   └── SectionHeading.astro
├── data/
│   ├── units.json     ← the unit inventory (edit this)
│   └── site.json      ← building name, address, phone, Formspree ID
├── layouts/BaseLayout.astro     Head tags, SEO, JSON-LD, header/footer
├── lib/
│   ├── units.ts       Types + formatting helpers over units.json
│   └── gallery.ts     Gallery image manifest and captions
├── pages/             index, availability, gallery, location, contact, 404
└── styles/global.css  Tailwind import + design tokens
public/                favicon, robots.txt, _headers, _redirects
```

---

## Editing without code: the dashboard

Open `/admin` on the running site (locally `http://localhost:4321/admin`, after starting
`npx decap-server` alongside `npm run dev`). Every word, price, photo and setting is editable there:

| Dashboard section | What it edits | File(s) behind it |
| --- | --- | --- |
| Residences | One entry per unit — price, status, beds, plan | `src/data/units/*.json` |
| Photo gallery | Photos, captions, categories, order | `src/data/photos.json` + `src/assets/gallery/` |
| Page text | One entry per page — every heading, paragraph, button, form label | `src/data/pages/*.json` |
| Site-wide text | Menu, header, footer, unit-card labels | `src/data/shared.json` |
| Building info | Name, address, phone, hours, brokerage, Formspree ID, unit terminology | `src/data/site.json` |

Behaviour that follows the data automatically: the sale/lease filter, tiles and badges only appear
when both offerings exist; the "15 of 24 residences are available" sentence is computed; a
Location-page section disappears if its list is emptied.

## Unit data format

Each file in `src/data/units/` is one residence:

```jsonc
{
  "unit": "907",                       // unit number, displayed as the card title
  "floor": 9,
  "planId": "e",                       // maps to src/assets/units/plan-e.jpg
  "floorPlan": "Plan E — The Everly",  // display name of the floor plan
  "sqft": 1820,
  "beds": 3,                           // 0 renders as "Studio"
  "baths": 3,                          // halves are fine: 2.5
  "listingType": "sale",               // "sale" | "lease"
  "price": 2150000,                    // total for sale, monthly for lease
  "status": "available",               // "available" | "pending" | "sold"
  "exposure": "South",
  "availableOn": "2026-09-01",         // ISO date, or null
  "features": ["Chef's kitchen", "Wrap terrace"]   // first 3 are shown
}
```

Add, remove or edit entries freely — the availability counts, the price-from figures on the home
page, the floor-plan summary table and the contact form's residence dropdown are all derived from
this file. To add a sixth floor plan, drop `plan-f.jpg` into `src/assets/units/` — images are matched by
file name, and add the new letter to the `planId` options in `public/admin/config.yml`.

**Filtering** on the Availability page is client-side and supports deep links, so you can send
someone straight to a filtered view:

```
/availability?type=lease&beds=2&status=available&sort=price-asc
```

---

## Replacing images

Put replacements in `src/assets/` and Astro generates responsive AVIF/WebP/JPEG variants at build
time — never in `public/`, which is served as-is with no optimization.

- **Gallery**: use the Photo gallery section of the dashboard, or edit `src/data/photos.json`.
  Set `wide: true` on an image to make it span two columns.
- **Hero**: `src/assets/hero.jpg`. Supply at least 2560px wide.
- **Social preview**: `src/assets/og-image.jpg`, 1200×630.

Write real alt text as you go — the placeholders describe placeholders.

---

## Connecting the contact form

The Contact page posts to [Formspree](https://formspree.io).

1. Create a form in Formspree and copy the hashid from the endpoint it gives you
   (`https://formspree.io/f/**xxxxxxxx**`).
2. Put that hashid in `formspreeId` in `src/data/site.json`.

Until you do, a warning appears on the Contact page in development only. The form submits over
`fetch` and shows an inline confirmation; with JavaScript disabled it falls back to a normal POST
and Formspree's own thank-you page. A hidden `_gotcha` honeypot field is included for spam.

---

## Other content to replace before launch

- `src/data/site.json` — building name, tagline, address, phone, email, coordinates, gallery hours,
  brokerage and license numbers, and the stat band on the home page.
- `astro.config.mjs` — set `SITE` to the production domain. This drives canonical URLs, Open Graph
  tags and `sitemap-index.xml`.
- `public/robots.txt` — update the sitemap URL to match.
- **Location page** — the neighborhood lists, walk/transit/bike scores and commute times in
  `src/pages/location.astro` are invented. The map is an OpenStreetMap embed driven by `geo` in
  `site.json`; swap the `mapEmbed` URL for a Google Maps Embed API URL if you prefer.
- **Legal** — the footer disclosure and the contact form's consent text are placeholders. Have the
  brokerage supply the required disclosures for your jurisdiction.

---

## Deploying to Cloudflare Pages

The site is fully static, so no adapter is required.

### Option A — Git integration (recommended)

Push the repo to GitHub or GitLab, then in the Cloudflare dashboard:
**Workers & Pages → Create → Pages → Connect to Git**, and use:

| Setting                | Value          |
| ---------------------- | -------------- |
| Framework preset       | Astro          |
| Build command          | `npm run build`|
| Build output directory | `dist`         |
| Node version           | `22` (set a `NODE_VERSION` environment variable if the build picks an older one) |

Every push to the production branch deploys; other branches get preview URLs.

### Option B — Direct upload

```bash
npx wrangler login && npm run deploy
```

`wrangler.toml` already sets `pages_build_output_dir = "dist"`.

### Headers and redirects

`public/_headers` sets security headers and caches the fingerprinted `/_astro/*` assets forever.
`public/_redirects` holds vanity redirects (`/listings` → `/availability`, etc.). Both are picked up
by Cloudflare Pages automatically.

### Custom domain

Add it under the Pages project's **Custom domains** tab, then update `SITE` in `astro.config.mjs`
and the sitemap line in `public/robots.txt` to match.

---

## Notes on the build

- **Accessibility**: skip link, visible focus rings, labelled form controls, `aria-pressed` filter
  buttons, live result counts, and `prefers-reduced-motion` handling.
- **No JavaScript framework.** The filter grid, gallery lightbox, mobile nav and contact form are
  small vanilla scripts. With JS disabled every page still renders: the filter bar and lightbox hide
  themselves and all units and images remain visible.
- **Fonts** load from Google Fonts (Cormorant Garamond + Inter). To self-host instead, add
  `@fontsource/...` packages and drop the `<link>` in `BaseLayout.astro`.
