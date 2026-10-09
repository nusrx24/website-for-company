import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

/**
 * The site is a single page, so there is exactly one collection: the homepage
 * content. Every section below maps to one partial in src/layouts/partials/,
 * which keeps copy editable without touching markup.
 *
 * Each section answers one question, and nothing else belongs in it:
 *   banner    - what does LapCircuit do?
 *   about     - why does custom software matter?
 *   solutions - what can LapCircuit build?
 *   projects  - has it been built for real businesses?
 *   final_cta - how do I contact you?
 *
 * Claims policy encoded here: there is no field for a metric, a percentage
 * or a testimonial anywhere in this schema. If a number cannot be verified
 * it has nowhere to live, which is deliberate.
 *
 * The one number is `projects.customers.title`, a count of customers that
 * the owner supplied and stands behind (2026-10-07). Nobody else should
 * write or raise it.
 */
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.md", base: "src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      title: z.string(),
      // One short sentence shown highlighted under the headline: how the
      // software is paid for.
      promise: z.string().optional(),
      content: z.string(),
      // `link: "whatsapp"` resolves to the number in config.json at render time,
      // so the phone number is never duplicated into content files.
      button_primary: z.object({ label: z.string(), link: z.string() }),
      // A plain text link, not a second button.
      link_secondary: z.object({ label: z.string(), link: z.string() }),
    }),

    about: z.object({
      eyebrow: z.string().optional(),
      // `<br>` starts a new line in the headline.
      title: z.string(),
      paragraphs: z.array(z.string()),
      features: z.array(z.string()).optional(),
      supporting: z.string().optional(),
      closing: z.string().optional(),
      media: z
        .object({
          image: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
        })
        .optional(),
    }),

    // Each solution is printed as a till receipt (see Solutions.astro).
    solutions: z.object({
      title: z.string(),
      content: z.string().optional(),
      // Wording shared by every receipt.
      receipt: z.object({
        // What stands at the end of each included line, e.g. "Incl".
        included: z.string(),
        // Small lines above the total. Facts stated elsewhere on the page
        // only (hardware, warranty) - never a discount or a saving.
        extras: z.array(z.object({ label: z.string(), value: z.string() })),
        // The total line of a solution that has no starting price.
        quote_label: z.string(),
        quote_value: z.string(),
        // The button on each receipt, and the sign-off under the barcode.
        cta: z.string(),
        thanks: z.string(),
      }),
      items: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
          // What the price includes, one short line each.
          lines: z.array(z.string()),
          // Optional rubber stamp. A plain fact about the solution, not a
          // claim such as "popular".
          badge: z.string().optional(),
          // Shown as the total: "<price_prefix> <price>", e.g. "From
          // LKR 30,000+". Leave `price` out for work that is quoted.
          price_prefix: z.string().optional(),
          price: z.string().optional(),
          // Prefills the WhatsApp message so an enquiry arrives with context.
          enquiry: z.string(),
        }),
      ),
    }),

    projects: z.object({
      title: z.string(),
      // Short uppercase line shown above the supporting sentence.
      label: z.string().optional(),
      content: z.string().optional(),
      // Optional link under the supporting sentence (e.g. the Facebook page).
      link: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
      // Shown under the logos: how many customers there are, in the owner's
      // own words and by the owner's own count.
      customers: z.object({ title: z.string() }).optional(),
      // The clients. The page shows them as a carousel of tiles, so a client
      // appears once it has a `name` and a `logo`. The logo is the client's
      // own. For a client who has not supplied one, the owner had a stand-in
      // drawn (public/images/clients/placeholder-logos): those are not the
      // businesses' real logos and give way to the real one when it arrives.
      items: z.array(
        z.object({
          name: z.string(),
          // The tile: a path under public/, e.g.
          // /images/clients/uj-stores.webp. A client without one is not shown.
          logo: z.string().optional(),
          // Not printed at present. These belonged to the earlier design, a
          // card per client with a photograph, and are kept so that design
          // can come back without the text being written again.
          sector: z.string().optional(),
          location: z.string().optional(),
          // What LapCircuit built. No metrics, no outcomes.
          summary: z.string().optional(),
          image: z
            .object({
              src: z.string(),
              alt: z.string(),
              // Which part of the photo to keep when a card crops it, as a
              // CSS object-position, e.g. "50% 30%" keeps the upper middle.
              focus: z.string().optional(),
            })
            .optional(),
        }),
      ),
    }),

    final_cta: z.object({
      // `<br>` starts a new line in the headline.
      title: z.string(),
      content: z.string(),
      // Optional. Left out, the section is a headline and a sentence; the
      // ways to reach us are in the footer directly below it.
      button: z.object({ label: z.string(), link: z.string() }).optional(),
    }),

    // Shown in the footer.
    locations: z.object({
      // The main place, as a card that opens to a drawn map when clicked.
      // `coordinates` are shown once it is open, `tag` is the small pill in
      // its corner, `hint` appears under it when it is pointed at.
      card: z
        .object({
          name: z.string(),
          coordinates: z.string().optional(),
          tag: z.string().optional(),
          hint: z.string().optional(),
        })
        .optional(),
      // The other places, listed under the card.
      places: z.array(z.string()),
      languages: z.array(z.string()).default(() => []),
    }),
  }),
});

export const collections = {
  homepage: homepageCollection,
};
