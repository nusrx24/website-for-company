import type { CollectionEntry } from "astro:content";

// ─── Content Collection Data Types ───────────────────────────────────────────
// Derived directly from the Zod schema in content.config.ts — always in sync.

export type Homepage = CollectionEntry<"homepage">["data"];

// ─── Config File Types ────────────────────────────────────────────────────────

export interface NavLink {
  name: string;
  url: string;
}

export interface Menu {
  main: NavLink[];
  footer: NavLink[];
}

export interface SocialLink {
  name: string;
  link: string;
}

export interface SocialType {
  main: SocialLink[];
}
