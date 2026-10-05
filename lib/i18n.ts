import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import type en from "./dictionaries/en.json";

export type Dictionary = typeof en;

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default as Dictionary),
  pl: () =>
    import("./dictionaries/pl.json").then((m) => m.default as DeepPartial<Dictionary>),
};

export type Locale = keyof typeof dictionaries;

export const locales = Object.keys(dictionaries) as Locale[];

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function deepMerge(
  base: Record<string, unknown>,
  overlay: unknown,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  if (!isObject(overlay)) return result;
  for (const [key, value] of Object.entries(overlay)) {
    if (value === undefined) continue;
    const baseValue = result[key];
    result[key] =
      isObject(baseValue) && isObject(value)
        ? deepMerge(baseValue, value)
        : value;
  }
  return result;
}

export const getDictionary = async (): Promise<Dictionary> => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  if (locale === "en") return dictionaries.en();
  const [base, localized] = await Promise.all([
    dictionaries.en(),
    dictionaries[locale](),
  ]);
  return deepMerge(base, localized) as Dictionary;
};
