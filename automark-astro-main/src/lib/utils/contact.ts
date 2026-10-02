import config from "@/config/config.json";

const { whatsapp_number, whatsapp_message, footer_email, footer_phone } =
  config.params;

/**
 * Build a wa.me deep link. Every WhatsApp CTA on the site goes through here so
 * the number lives in exactly one place (src/config/config.json).
 *
 * @param message Optional context-specific prefill, e.g. which solution the
 *                visitor was looking at. Falls back to the generic demo request.
 */
export const whatsappUrl = (message?: string): string =>
  `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(
    message ?? whatsapp_message,
  )}`;

/** `tel:` link in E.164 form. */
export const telUrl = `tel:+${whatsapp_number}`;

/** `mailto:` link for the public address. */
export const mailtoUrl = (subject?: string): string =>
  subject
    ? `mailto:${footer_email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${footer_email}`;

export const contact = {
  email: footer_email,
  phoneDisplay: footer_phone,
  whatsappNumber: whatsapp_number,
};
