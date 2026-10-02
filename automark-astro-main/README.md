# LapCircuit website

The official website for **LapCircuit** — practical POS and business management
software for retail, grocery, restaurant, mobile shop, wholesale, distribution
and multi-branch businesses.

Built with Astro 7, Tailwind CSS 4 and TypeScript. The homepage is fully static:
there is no backend, no database and no third-party payment or CRM integration.
Every call to action opens WhatsApp or email directly.

## Running it locally

`pnpm` is not required to be installed globally — `npx` can fetch it:

```bash
npx --yes pnpm@11.9.0 install --fetch-timeout 300000   # first time only
npx astro dev                                          # http://localhost:4321
```

`astro dev` runs in the background and returns your terminal:

| Command | What it does |
| --- | --- |
| `npx astro dev` | Start the site on http://localhost:4321 |
| `npx astro dev status` | Is it running? |
| `npx astro dev stop` | Stop it |
| `npx astro dev logs` | Show server output and errors |
| `npx astro check` | Type-check content and components |
| `npx astro build` | Build the production site into `dist/` |
| `node scripts/themeGenerator.js` | Rebuild theme CSS after editing `theme.json` |

If a content edit does not appear, delete the `.astro` folder and restart —
the content collection cache can go stale and fails with
`No page found for the collection: homepage`.

## Where to edit what

| To change | Edit |
| --- | --- |
| All homepage copy, prices, projects | `src/content/homepage/-index.md` |
| Colours and fonts | `src/config/theme.json`, then run the theme generator |
| Site title, domain, phone, email | `src/config/config.json` |
| Navigation and footer links | `src/config/menu.json` |
| A section's layout | `src/layouts/partials/<Section>.astro` |
| Section order | `src/pages/index.astro` |

The homepage is content-driven: `content → partial → page`. Wording changes
should only ever touch `-index.md`.

## Content rules

These are enforced by the schema in `src/content.config.ts`, which deliberately
has **no field** for metrics, percentages, customer counts or testimonials:

- No invented statistics, growth figures or satisfaction scores.
- Only verified projects (UJ Stores, MBRK Rice Distribution, Red Zone).
- Prices are always labelled as starting prices, and `pricing.note` is required.
- The warranty boundary (`warranty.excluded`) is required, so the limit can
  never be dropped from the promise.

## Before going live

1. **Set the real domain.** `site.base_url` in `src/config/config.json` is the
   single place it is configured — it feeds the canonical tags, Open Graph URLs
   and the sitemap. The build warns while the `.example` placeholder is in use.
2. **Add real legal pages** if you start collecting personal data. The
   template's privacy and terms pages were placeholder text and were removed,
   along with the footer column that linked to them.
3. **Check `public/`.** Everything in it is published at a guessable URL even
   when nothing links to it. Private originals live in `project-photos-source/`,
   outside `public/`, and must stay there.

## Project photos

See `PROJECT-PHOTOS.md` at the repository root for how to add client
screenshots, and `project-photos-source/README.md` for which images must never
be published and why.
