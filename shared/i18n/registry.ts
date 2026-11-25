export interface LocaleInfo {
  /** Registry key and URL path segment (lowercase): /<code>/ */
  code: string;
  /** BCP 47 tag for <html lang> and every Intl formatter. */
  lang: string;
  /** The language's own name for itself. */
  nativeName: string;
  dir: "ltr" | "rtl";
  reviewed: boolean;
}

export const DEFAULT_LOCALE = "en";

export const LOCALES: readonly LocaleInfo[] = [
  { code: "en", lang: "en", nativeName: "English", dir: "ltr", reviewed: true },
];

export function localeByCode(code: string): LocaleInfo | undefined {
  return LOCALES.find((l) => l.code === code);
}

const BARE_LANGUAGE_ALIASES: Record<string, string> = {};

export function matchLocale(preferred: readonly string[]): LocaleInfo | undefined {
  for (const raw of preferred) {
    const tag = raw.toLowerCase();
    const exact = localeByCode(tag) ?? localeByCode(BARE_LANGUAGE_ALIASES[tag] ?? "");
    if (exact) return exact;
    const bare = tag.split("-")[0]!;
    const byBare =
      localeByCode(bare) ?? localeByCode(BARE_LANGUAGE_ALIASES[bare] ?? "");
    if (byBare) return byBare;
  }
  return undefined;
}
