import type { Messages } from "./messages";

export const loaders: Record<string, () => Promise<{ messages: Messages }>> = {
  en: () => import("./locales/en"),
};
