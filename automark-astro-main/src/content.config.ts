import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

/**
 * The site is a single page, so there is exactly one collection: the homepage
 * content. Every section below maps to one partial in src/layouts/partials/,
 * which keeps copy editable without touching markup.
 *
 * Claims policy encoded here: no metric, percentage, customer count or
 * testimonial field exists anywhere in this schema. If a number cannot be
 * verified it has nowhere to live, which is deliberate.
 */
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string(),
      // Headline price signal. Shown as a labelled figure, never as a fixed quote.
      price_signal: z
        .object({ label: z.string(), value: z.string() })
        .optional(),
      // `link: "whatsapp"` resolves to the number in config.json at render time,
      // so the phone number is never duplicated into content files.
      button_primary: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
      button_secondary: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
      // Truthful capability statements only - no invented customer counts.
      trust_signals: z.array(z.string()).default(() => []),
      locations: z.array(z.string()).default(() => []),
      media: z
        .object({
          video: z.string().optional(),
          poster: z.string().optional(),
          caption: z.string().optional(),
        })
        .optional(),
    }),

    /**
     * A product demonstration rather than a feature list: four acts of one
     * sale, each paired with a working mock of the matching POS screen.
     * `key` selects which mock renders, so the copy stays editable here while
     * the interface itself lives in src/layouts/partials/benefits/.
     */
    benefits: z.object({
      enable: z.boolean(),
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string().optional(),
      // Shown under the mocks. Required, because the screens contain example
      // figures and must never be mistaken for a customer's real numbers.
      demo_note: z.string(),
      acts: z.array(
        z.object({
          key: z.enum(["checkout", "stock", "report", "receipt"]),
          kicker: z.string(),
          title: z.string(),
          content: z.string(),
        }),
      ),
    }),

    solutions: z.object({
      enable: z.boolean(),
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string().optional(),
      items: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
          points: z.array(z.string()).default(() => []),
          size: z.enum(["sm", "md", "lg"]).default("md"),
          featured: z.boolean().default(false),
        }),
      ),
    }),

    why_lapcircuit: z.object({
      enable: z.boolean(),
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string().optional(),
      items: z.array(z.object({ title: z.string(), content: z.string() })),
    }),

    // A genuine ordered sequence, which is why these steps are numbered.
    process: z.object({
      enable: z.boolean(),
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string().optional(),
      steps: z.array(z.object({ title: z.string(), content: z.string() })),
    }),

    pricing: z.object({
      enable: z.boolean(),
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string().optional(),
      // Required, not optional: a starting price must never appear unqualified.
      note: z.string(),
      cta_label: z.string(),
      tiers: z.array(
        z.object({
          name: z.string(),
          price_prefix: z.string().optional(),
          price: z.string(),
          description: z.string(),
          features: z.array(z.string()).default(() => []),
          featured: z.boolean().default(false),
          // Prefills the WhatsApp message so an enquiry arrives with context.
          enquiry: z.string(),
        }),
      ),
    }),

    projects: z.object({
      enable: z.boolean(),
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string().optional(),
      items: z.array(
        z.object({
          // `name` is the public label. Set `name_public: false` for a client
          // who has not agreed to be named - the card then shows `alias`.
          name: z.string(),
          name_public: z.boolean().default(true),
          alias: z.string().optional(),
          location: z.string().optional(),
          sector: z.string(),
          summary: z.string(),
          // Only what the system genuinely handles. No metrics, no outcomes.
          handles: z.array(z.string()).default(() => []),
          setup: z.string().optional(),
          images: z
            .array(z.object({ src: z.string(), alt: z.string() }))
            .default(() => []),
        }),
      ),
      // Photographs of the systems in real use, shown beneath the cards.
      gallery: z
        .object({
          enable: z.boolean().default(true),
          caption: z.string().optional(),
          items: z
            .array(z.object({ src: z.string(), alt: z.string() }))
            .default(() => []),
        })
        .optional(),
    }),

    hardware: z.object({
      enable: z.boolean(),
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string().optional(),
      image: z.string().optional(),
      image_alt: z.string().optional(),
      note: z.string().optional(),
      // No model numbers or specifications: we only state what we supply.
      items: z.array(z.object({ title: z.string(), content: z.string() })),
    }),

    warranty: z.object({
      enable: z.boolean(),
      eyebrow: z.string().optional(),
      title: z.string(),
      covered_label: z.string(),
      covered: z.string(),
      // Required, so the boundary can never be dropped from the promise.
      excluded_label: z.string(),
      excluded: z.string(),
    }),

    company: z.object({
      enable: z.boolean(),
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string(),
      team_label: z.string().optional(),
      team: z.array(z.object({ name: z.string(), role: z.string() })),
    }),

    locations: z.object({
      enable: z.boolean(),
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string().optional(),
      places: z.array(z.string()),
      languages: z.array(z.string()).default(() => []),
    }),

    final_cta: z.object({
      enable: z.boolean(),
      title: z.string(),
      content: z.string(),
      // `link` accepts "whatsapp", "email", or any plain href.
      button_primary: z.object({ label: z.string(), link: z.string() }),
      button_secondary: z.object({ label: z.string(), link: z.string() }),
    }),
  }),
});

export const collections = {
  homepage: homepageCollection,
};
