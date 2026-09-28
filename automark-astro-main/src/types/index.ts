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
  footer_col_1_title: string;
  footer_col_2_title: string;
  footer_primary: NavLink[];
  footer_resource: NavLink[];
}

export interface SocialLink {
  name: string;
  icon: string;
  link: string;
}

export interface SocialType {
  main: SocialLink[];
}
