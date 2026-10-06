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
 *   process   - how do you work?
 *   final_cta - how do I contact you?
 *
 * Claims policy encoded here: no metric, percentage, customer count or
 * testimonial field exists anywhere in this schema. If a number cannot be
 * verified it has nowhere to live, which is deliberate.
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
      title: z.string(),
      paragraphs: z.array(z.string()),
      // Shown under the heading. A real screenshot or photo of delivered
      // work, never a mock-up.
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
      items: z.array(
        z.object({
          name: z.string(),
          sector: z.string(),
          location: z.string().optional(),
          // What LapCircuit built. No metrics, no outcomes.
          summary: z.string(),
          // The client's own logo, shown as a small tile on the open card.
          // A path under public/, e.g. /images/clients/uj-stores.webp.
          logo: z.string().optional(),
          image: z.object({
            src: z.string(),
            alt: z.string(),
            // Which part of the photo to keep when the card crops it, as a
            // CSS object-position, e.g. "50% 30%" keeps the upper middle.
            focus: z.string().optional(),
          }),
        }),
      ),
    }),

    // A genuine ordered sequence, which is why these steps are numbered.
    process: z.object({
      title: z.string(),
      content: z.string().optional(),
      steps: z.array(z.object({ title: z.string(), content: z.string() })),
      // Wording for the brick builder: the steps are bricks that stack, in
      // order, on a base brick.
      builder: z.object({
        // Printed on the base brick.
        base: z.string(),
        // Under it before anything is built, without and with JavaScript.
        idle: z.string(),
        hint: z.string(),
        // While building. {n} and {total} are filled in.
        progress: z.string(),
        // Once every step is in place.
        done: z.string(),
      }),
      // The warranty promise and its limit, always stated together.
      warranty: z.string().optional(),
    }),

    final_cta: z.object({
      title: z.string(),
      content: z.string(),
      button: z.object({ label: z.string(), link: z.string() }),
    }),

    // Shown in the footer.
    locations: z.object({
      places: z.array(z.string()),
      languages: z.array(z.string()).default(() => []),
    }),
  }),
});

export const collections = {
  homepage: homepageCollection,
};
