# LapCircuit website

The official website for **LapCircuit** — practical POS and business management
software built around the way a business actually works.

Built with Astro 7, Tailwind CSS 4 and TypeScript. The site is one static page:
there is no backend, no database, no UI framework and no third-party request at
runtime. Every call to action opens WhatsApp, the phone dialler or email.

## The page

Five sections, each answering one question. If something does not help answer
the question, it does not belong in that section.

| Section | Partial | Answers |
| --- | --- | --- |
| Hero | `Hero.astro` | What does LapCircuit do? |
| About | `About.astro` | Why does custom software matter? |
| Solutions | `Solutions.astro` | What can LapCircuit build? (printed as till receipts) |
| Work | `Work.astro` | Has it been built for real businesses? |
| Closing | `FinalCta.astro` | What is the offer? (the ways to reach us are in the footer below it) |

Design rules that keep it that way:

- **Static by default.** Six things move by themselves: the band of light
  on the button (`.btn-shiny`) and the 2px chrome edge round every picture
  (`.metal-frame`), both in `src/styles/components.css`; the section
  headlines, whose letters breathe from light to heavy (see below); the hero
  headline, which is scanned (see below); the blue lines that
  flow behind the hero (`BackgroundPaths.astro`, which pauses itself whenever
  the hero is scrolled out of view); and the clients' logos, which change
  every two seconds (`LogoCarousel.astro`, which also stops off screen). Everything
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
  dots underneath; stacked, they ran to more than four screens. The row is
  used up to 672px wide, which is where two receipts first fit side by side.
- **One highlighted sentence under the hero headline.** `banner.promise`
  (how the software is paid for) is picked out in blue like a highlighter,
  between the headline and the opening sentence. Leave it out of
  `-index.md` and nothing is shown. It replaced the panel of pricing notes
  that used to sit under the receipts.
- **The footer is a dark slate block** (the colour of the site's panels) in
  off-white monospace capitals. Its whole palette is four variables at the
  top of the styles in `Footer.astro`: `--sgf-bg` (the ground), `--sgf-top`
  (its lighter top edge), `--sgf-ink` (everything printed on it) and
  `--sgf-accent` (blue: the shutter letter). It opens with the four places
  to find us (see below). The company name runs across the full width in letters
  drawn as SVG
  (`src/lib/footer/glyphs.ts`; no font is loaded for them). One letter is a
  "shutter" whose blades follow the pointer and turn when clicked; letters
  split on hover and flip when clicked; links scramble on hover. Which letter
  the shutter replaces is `SHUTTER_AT` at the top of `Footer.astro`.
- **There is no "How we work" section.** The six steps and their brick
  builder were removed at the owner's request; the page goes from the clients
  straight to the closing section. The warranty is now stated only on the
  receipts ("Bug-fix warranty: Lifetime").
- **Clients are a carousel of their own logos** (`Work.astro` and
  `LogoCarousel.astro`). Four logos show at a time, each as a small rounded
  tile; every two seconds a logo lifts away and the next settles in, the
  columns a fifth of a second apart. The logos are shuffled on every visit
  and dealt out to the columns, each logo to one column only, so none is
  ever on screen twice; if they do not divide evenly some columns simply
  hold one more than others.
  To add a client, put its logo in `public/images/clients/` and add an entry
  with `name` and `logo` to `projects.items` in `-index.md`. With reduced
  motion, or without JavaScript, every logo is shown in one plain row. The
  names are in the page as a hidden list for screen readers. The section's
  intro can carry a small label and a link (`projects.label`,
  `projects.link`).
- **Customers without a logo are in the same carousel, with a stand-in.**
  At the owner's request, a logo was drawn for each customer who had not
  supplied one: the eight files in `public/images/clients/placeholder-logos/`
  (a serving dome for the restaurant, a cup for the cafe, a book, a burger,
  wheat, a phone, a car, each in its own colours and lettering). They were
  designed for this page from the business's name and trade alone. They are
  **not** the logos those businesses use, and must not be described as
  such. When a real logo arrives, put it in `public/images/clients/` and
  point that entry's `logo` at it; ask each business whether it is content
  to be shown this way until then. Spell each name as the business spells
  it on its own sign. Size: 400 by 424.
- **Under the logos: a count of customers** (`projects.customers.title` in
  `-index.md`, at present "25+ real customers"). It is the owner's own count and
  the one number on the page: only the owner changes it, and it must stay
  true.
- **The client photographs and descriptions are not shown at present.** They
  belonged to the earlier design, a card per client. The text is still under
  `projects.items` and the photographs are still in
  `public/images/projects/`, all of them now unused.
  Delete them before going live if that design is not coming back: everything
  in `public/` is published.
- **The footer opens with where else to find us.** Facebook, LinkedIn,
  WhatsApp and Email as four round icon buttons on a line of their own
  (`SocialLinks.astro`). Pointing at one fills the circle from the bottom up
  in that network's colour and shows its name on a small label underneath;
  the same happens when it is reached with the keyboard. On a touch screen
  there is no label: the circle fills the moment it is touched and stays
  filled a quarter of a second after the finger lifts (a small script marks
  the button `is-pressed`, because phones do not all apply `:active` to a
  touched link and a tap is too short to see otherwise). Each network's
  colour is in the `ICONS` list at the top of the component (email, which
  has no colour of its own, takes the site's blue). The profile links come
  from `social.json`; WhatsApp and email from `config.json`. The footer
  leaves 20px under the buttons for the label, so it never lands on the
  links below. The closing section above is just a headline and a sentence.
- **The footer shows the main place as a card** (`LocationCard.astro`, filled
  from `locations.card` in `-index.md`). It is a small navy card with the
  town's name; it leans towards the pointer, and a click or a tap opens it
  into a drawn map with a pin and the town's coordinates. The map is a
  drawing, not a map of the town. The whole card is the site's blue at
  different strengths, like a plan on blueprint paper; its colours are the
  `--loc-…` lines at the top of the component's `<style>`, each mixed from
  the theme's own colours. The card is a real button, so it opens from the
  keyboard (Enter or Space) and says whether it is open; with reduced motion
  it opens at once and does not lean. The other places are listed under it
  (`locations.places`), then the languages. Leave `locations.card` out and
  the footer is two plain lines. On a wide screen this block stands at the
  right of the footer's middle column, beside the contact links (`.sgf-copy`
  in `Footer.astro`); its box is as wide as the open card, so opening the
  card moves nothing sideways. On a phone it is at the left margin with the
  rest.
- **Headings and paragraphs are Noto Sans; the interface is IBM Plex Mono.**
  Noto Sans is a variable font: one 35 KB file carries every weight from 100
  to 900 (`secondary` in `theme.json`, written `Noto+Sans:wght@100..900`).
  Headings are set in sentence case. Every paragraph and picture caption
  uses it too, at 16px, through one rule in `base.css`. The mono
  (`primary`) is kept for what is not a paragraph: the menu, buttons, links
  standing alone, labels and numbers. The receipts and the footer keep the
  mono for all of their lettering, paragraphs included, because each is an
  object with its own print.
- **Headlines breathe.** Add `data-breathe` to a heading and its letters swell
  from the lightest weight to 840 and back, one after another
  (`src/lib/breathe.ts` and "Breathing headline" in `components.css`). The
  script pins each headline's line breaks at its heaviest first, so the
  moving letters never re-wrap a line or push the page about. It is on the
  four section headlines. The hero headline has an effect of its own.
- **The hero headline is scanned.** It is shown at a quarter of its strength
  except for a band at full strength that sweeps across it and back every
  2.6 seconds, with a thin glowing blue line travelling with the band
  ("Scanner" in `Hero.astro`, a port of a "text scanner" component). It is
  a moving mask over the headline, so the blue words keep their colour. A
  small script makes the line turn round where the words end when the
  headline wraps on a phone, and rests the sweep off screen. With reduced
  motion the headline is simply there, at full strength.
- **Blue words in the hero headline.** In `banner.title`, words wrapped in
  `**two asterisks**` are set in the brand's blue; the rest are white.
- **Framing a picture.** Wrap the image in `<div class="metal-frame">`, or put
  the class on a `<figure>` that holds only the image. It is plain CSS: no
  shader library and no canvas.
- **One button style.** Markup is
  `<a class="btn btn-shiny"><span>Label</span></a>`; the inner `<span>` is
  required. Add `btn-sm` for the small size.
- **One call to action, plus a quote button on each receipt.** "Request a
  Demo" appears in the hero. The header carries a small copy that hides
  itself while the hero's is on screen. The closing section has no button
  (removed at the owner's request; `final_cta.button` in `-index.md` is
  optional and brings one back). Do not add buttons inside sections.
- **The About section is a statement, a picture and one sentence.** The
  statement runs across the top in two lines (`<br>` in `about.title`
  starts the second; `&nbsp;` keeps two words together). Under it the
  picture sits in the chrome frame with its caption, and the sentence
  (`about.paragraphs`) beside it, or under it on a phone.
- **The About picture is an illustration, not a client's system.** It is a
  designed dashboard with sample names and figures, chosen by the owner in
  place of the real UJ Stores screenshot (`public/images/about/`; the file
  is the owner's picture trimmed of the empty background it had on the right
  and along the bottom). Its caption and alt text therefore name no client and
  call it an illustration. Keep it that way: never caption it as a real
  customer's system or quote its numbers as results. No stock photography.
- **Blue is for the button, the prices and link hovers.** Everything else is
  black, slate and white.
- **Numbers only where there is a sequence.** Nothing on the page is one at
  present, so nothing is numbered (a receipt's own number is part of the
  receipt).

## On a phone

The page is laid out for a phone first; these are the rules that keep it
that way. Check any change at 320, 360 and 430 pixels wide, and also at 600
and 667: the widths between a phone and a tablet (small tablets, phones held
sideways) are where a layout meant for one or the other goes wrong unseen.

- **Nothing scrolls sideways** except the row of receipts, which is meant to.
- **Anything tapped is at least 44px tall**: buttons, links standing alone,
  the menu button, the footer's social names and links.
- **The header is 60px tall** below 900px wide (72px above), and in-page
  links stop with a section's top line directly beneath it.
- **The hero headline is sized from the screen's width** (three lines on a
  phone), and "Request a Demo" runs the full width in the hero, on the
  first screen.
- **The footer's page links sit two to a row.**
- **Text is never below 11px**, and receipts are a size larger than on a
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
| Facebook and LinkedIn links | `src/config/social.json` |
| A section's layout | `src/layouts/partials/<Section>.astro` |
| Section order | `src/pages/index.astro` |
| Shared buttons, links, spacing | `src/styles/components.css` |
| Header and phone menu | `src/styles/navigation.css` |
| Client logos | `public/images/clients/`, listed under `projects.items` in `-index.md` |
| How many logos show at once | `columns` on `<LogoCarousel>` in `Work.astro` |

The homepage is content-driven: `content → partial → page`. Wording changes
should only ever touch `-index.md`. Styles that belong to one section live in
that section's `.astro` file.

The phone number and email address live in `config.json` only and reach the
page through `src/lib/utils/contact.ts`. Do not type them anywhere else.

## Content rules

These are enforced by the schema in `src/content.config.ts`, which deliberately
has **no field** for metrics, percentages, customer counts or testimonials:

- No invented statistics, growth figures or satisfaction scores. The one
  number on the page is the count of customers under the logos: it is the
  owner's own figure, and only the owner changes it.
- Only real clients, shown by their own logos. Where a client has not
  supplied one, the owner chose to show a stand-in drawn for this page
  (`placeholder-logos/`); it is replaced by the real logo as soon as there
  is one, and is never added for a business that is not a customer. The one
  picture of a system (About) is an illustration with sample data and is not
  presented as a client's.
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
