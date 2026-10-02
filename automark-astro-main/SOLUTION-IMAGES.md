# Solutions section images

The six photographs behind the Solutions cards come from **Pexels**, whose
licence allows free commercial use with no attribution required and no
payment. They are the only stock photography on the site — every other image
is LapCircuit's own work.

Processed copies live in `public/images/solutions/` as `<id>-thumb.webp`
(160×160, card) and `<id>-wide.webp` (640×200, terminal banner). Total 129 KB
for all twelve files.

## Source photos

| Card | Pexels photo | Shows |
| --- | --- | --- |
| Retail & Grocery POS | [264636](https://www.pexels.com/photo/grocery-store-264636/) | Grocery produce aisle with shelf pricing |
| Restaurant POS | [5490972](https://www.pexels.com/photo/interior-of-modern-restaurant-with-dark-walls-and-furniture-5490972/) | Dark modern restaurant interior |
| Mobile Shop Management | [25809251](https://www.pexels.com/photo/tablets-standing-on-display-in-a-store-with-electronics-25809251/) | Tablets on a store display bench |
| Wholesale & Distribution | [5156696](https://www.pexels.com/photo/boxes-on-shelves-inside-a-warehouse-5156696/) | Warehouse racking aisle |
| Multi-Branch | [17565491](https://www.pexels.com/photo/stores-in-passage-17565491/) | A passage of separate phone and accessory shop units |
| Custom Software | [4164418](https://www.pexels.com/photo/black-screen-with-code-4164418/) | Code on a dark editor screen |

## Photos that were rejected, and why

Worth recording so nobody re-adds them later:

- **Apple Store interior** (11297769) — recognisable Apple retail branding and
  Apple Watch displays. Implies a relationship that does not exist.
- **Aerial luxury storefronts** (19446292) — Versace and Dior shopfronts.
- **Istanbul shopping centre** (15556611) — GUESS signage across the frame.
- **Parisian grocer** (10427698) — a single European shopfront; says nothing
  about multiple branches and is culturally distant from the audience.
- **Phone repair close-up** (10568286) — an identifiable person, and depicts
  repair work rather than a shop being run on a POS.

The rule applied: no third-party brand marks, no identifiable faces, nothing
implying an endorsement or partnership.

## The treatment

`scripts/` does not build these — they were processed once and committed. To
regenerate or swap one, the recipe is:

1. Convert to greyscale.
2. Measure mean luminance, then scale each image toward a shared target (78).
   Per-image `normalise()` is wrong here: it stretches each histogram on its
   own terms and pushes a bright supermarket and a dark code screen further
   apart rather than closer.
3. Apply the brand blue `#2E90FF` as a **partial** tint (~42%). A full-strength
   tint reads as a cheap blue filter.
4. Flatten onto the card surface `#141A23` so there is no bright edge.

Greyscale and tint must be separate sharp passes — chained in one pipeline,
sharp applies them in its own order and the tint is silently cancelled.

Final luminance lands between 34 and 45 for all six, which is what makes them
read as one set rather than six unrelated photographs.

## Replacing one

Drop a new source photo in, run the same treatment, and save it as
`<solution-id>-thumb.webp` and `<solution-id>-wide.webp`. The id is the
solution title slugified — e.g. `Restaurant POS` becomes `restaurant-pos`.
Nothing in `Solutions.astro` needs editing; it derives the paths from the
title.
