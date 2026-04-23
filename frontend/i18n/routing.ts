import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "da",
  locales: ["da", "en"],
  localePrefix: "never",
});
