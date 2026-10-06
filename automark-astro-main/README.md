# LapCircuit website

The official website for **LapCircuit** — practical POS and business management
software built around the way a business actually works.

Built with Astro 7, Tailwind CSS 4 and TypeScript. The site is one static page:
there is no backend, no database, no UI framework and no third-party request at
runtime. Every call to action opens WhatsApp, the phone dialler or email.

## The page

Six sections, each answering one question. If something does not help answer
the question, it does not belong in that section.

| Section | Partial | Answers |
| --- | --- | --- |
| Hero | `Hero.astro` | What does LapCircuit do? |
| About | `About.astro` | Why does custom software matter? |
| Solutions | `Solutions.astro` | What can LapCircuit build? (printed as till receipts) |
| Work | `Work.astro` | Has it been built for real businesses? |
| How we work | `Process.astro` (+ `LegoBrick.astro`) | How do you work? |
| Contact | `FinalCta.astro` | How do I contact you? |

Design rules that keep it that way:

- **Static by default.** Four things move by themselves: the band of light
  on the button (`.btn-shiny`) and the 2px chrome edge round every picture
  (`.metal-frame`), both in `src/styles/components.css`; the headlines, whose
  letters breathe from light to heavy (see below); and the blue lines that
  flow behind the hero (`BackgroundPaths.astro`, which pauses itself whenever
  the hero is scrolled out of view). Everything
  else only responds: hover and focus feedback, the phone menu opening, the
  header turning solid. The header's copy of the button uses `.btn-shiny--rest`
  so it stays still until hovered, a button's light rests while that button
  is scrolled out of view (`main.js` sets `.is-away`; on a slow phone the
  light was costing the rest of the page its smoothness), and all of it stops
  for visitors who ask their device for reduced motion.
- **Solutions are till receipts.** One slip per solution: what it includes,
  two small facts (hardware is optional, bugs are fixed for life), the starting
  price as the total, and a "Request a quote" button that opens WhatsApp with
  that solution named. All of the wording is under `solutions` in `-index.md`.
  Keep each included line to about 16 letters so it fits on one line of the
  slip. Paper and ink colours are set at the top of the styles in
  `Solutions.astro`. On a phone the slips lie in one row that is swiped
  sideways, one at a time, with the edge of the next showing and a row of
  dots underneath; stacked, they ran to more than four screens.
- **One highlighted sentence under the hero headline.** `banner.promise`
  (how the software is paid for) is picked out in blue like a highlighter,
  between the headline and the opening sentence. Leave it out of
  `-index.md` and nothing is shown. It replaced the panel of pricing notes
  that used to sit under the receipts.
- **The footer is a block of the brand's blue** in monospace capitals, with the
  company name across the full width in letters drawn as SVG
  (`src/lib/footer/glyphs.ts`; no font is loaded for them). One letter is a
  "shutter" whose blades follow the pointer and turn when clicked; letters
  split on hover and flip when clicked; links scramble on hover. Which letter
  the shutter replaces is `SHUTTER_AT` at the top of `Footer.astro`. The
  message box opens WhatsApp with whatever was typed: there is no mailing
  list and nothing is stored. Its two lines of wording are in `config.json`.
- **How we work is something you build.** "Your business" is a base brick and
  each step is a brick that goes on it, in order: clicking a step places it and
  every step before it; clicking a placed step lifts it and every step after
  it. Nothing moves until it is clicked. The numbered list underneath carries
  the same content in words. Brick colours live in `LegoBrick.astro`; widths
  and order in the `BRICKS` table at the top of `Process.astro`.
- **Clients are one block of expanding cards** (`Work.astro`), one card per
  client. The open card shows the photograph in colour with the client's logo,
  type of business, name and what we built; the others are grey strips with
  just the name. Pointing at, tabbing to or tapping a card opens it. To add a
  client, add an entry to `projects.items` in `-index.md`; the block keeps its
  height on a computer and grows by one short row on a phone. After a tap on
  a phone the opened card is scrolled fully into view. The section's intro
  can carry a small label and a link (`projects.label`, `projects.link`).
- **The closing section names where else to find us.** Facebook, LinkedIn,
  WhatsApp and Email, each with an icon that pops up when pointed at
  (`SocialLinks.astro`). The profile links come from `social.json`.
- **Headings are Noto Sans, in sentence case.** It is a variable font: one
  35 KB file carries every weight from 100 to 900 (`secondary` in
  `theme.json`, written `Noto+Sans:wght@100..900`). Body text stays IBM Plex
  Mono.
- **Headlines breathe.** Add `data-breathe` to a heading and its letters swell
  from the lightest weight to 840 and back, one after another
  (`src/lib/breathe.ts` and "Breathing headline" in `components.css`). The
  script pins each headline's line breaks at its heaviest first, so the
  moving letters never re-wrap a line or push the page about. It is on the
  hero headline and the five section headlines; item names (clients, steps)
  use the same font but stay still.
- **Blue words in the hero headline.** In `banner.title`, words wrapped in
  `**two asterisks**` are set in the brand's blue; the rest are white.
- **Framing a picture.** Wrap the image in `<div class="metal-frame">`, or put
  the class on a `<figure>` that holds only the image. It is plain CSS: no
  shader library and no canvas.
- **One button style.** Markup is
  `<a class="btn btn-shiny"><span>Label</span></a>`; the inner `<span>` is
  required. Add `btn-sm` for the small size.
- **Two calls to action, plus a quote button on each receipt.** "Request a
  Demo" appears in the hero and in the closing section. The header carries a small copy that hides itself while
  either of those is on screen. Do not add buttons inside sections or cards.
- **Real images only.** Screenshots and photographs of delivered systems. No
  mock-ups, renders or stock photography.
- **Blue is for the button, the prices and link hovers.** Everything else is
  black, slate and white.
- **Numbers only where there is a sequence.** "How we work" is numbered because
  it is a real order; nothing else is.

## On a phone

The page is laid out for a phone first; these are the rules that keep it
that way. Check any change at 320, 360 and 430 pixels wide.

- **Nothing scrolls sideways** except the row of receipts, which is meant to.
- **Anything tapped is at least 44px tall**: buttons, links standing alone,
  the menu button, footer links, the footer's message box and its arrow.
- **The footer's message box is set at 16px** on touch screens. Below that an
  iPhone zooms the whole page in when the box is tapped.
- **The header is 60px tall** below 900px wide (72px above), and in-page
  links stop with a section's top line directly beneath it.
- **The hero headline is sized from the screen's width** (three lines on a
  phone), and "Request a Demo" runs the full width in the hero and in the
  closing section, with the hero's button on the first screen.
- **The six steps are compact rows** (number, name, sentence), and the
  footer's page links sit two to a row.
- **Text meant to be read is never below 11px** (the letters embossed on the
  brick studs are decoration), and receipts are a size larger than on a
  computer.

## Running it locally

`pnpm` is not required to be installed globally — `npx` can fetch it:

```bash
npx --yes pnpm@11.9.0 install   # first time only
npx astro dev                   # http://localhost:4321
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
| Header and footer links | `src/config/menu.json` |
| Footer message box wording | `footer_message_*` in `src/config/config.json` |
| Facebook and LinkedIn links | `src/config/social.json` |
| A section's layout | `src/layouts/partials/<Section>.astro` |
| Section order | `src/pages/index.astro` |
| Shared buttons, links, spacing | `src/styles/components.css` |
| Header and phone menu | `src/styles/navigation.css` |
| Client photos and logos | `public/images/projects/` and `public/images/clients/`, listed under `projects.items` in `-index.md` |
| Brick colours | `src/layouts/components/LegoBrick.astro` |

The homepage is content-driven: `content → partial → page`. Wording changes
should only ever touch `-index.md`. Styles that belong to one section live in
that section's `.astro` file.

The phone number and email address live in `config.json` only and reach the
page through `src/lib/utils/contact.ts`. Do not type them anywhere else.

## Content rules

These are enforced by the schema in `src/content.config.ts`, which deliberately
has **no field** for metrics, percentages, customer counts or testimonials:

- No invented statistics, growth figures or satisfaction scores.
- Only real client work, shown with real photographs and the clients' own logos.
- Prices are always labelled as starting prices: each is printed as
  "From ... +", and the sentence under the Solutions heading says so.
- The warranty line states the promise and its limit together.

## Before going live

1. **Set the real domain.** `site.base_url` in `src/config/config.json` is the
   single place it is configured — it feeds the canonical tags, Open Graph URLs
   and the sitemap. The build warns while the `.example` placeholder is in use.
2. **Add real legal pages** if you start collecting personal data. The
   template's privacy and terms pages were placeholder text and were removed.
3. **Check `public/`.** Everything in it is published at a guessable URL even
   when nothing links to it. Private originals live in `project-photos-source/`,
   outside `public/`, and must stay there.

## Project photos

See `PROJECT-PHOTOS.md` for how to add client screenshots, and
`project-photos-source/README.md` for which images must never be published and
why. Before publishing a photograph, check that no real sales figure, customer
name or third party is legible in it.
