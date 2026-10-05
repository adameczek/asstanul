import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import type en from "./dictionaries/en.json";

export type Dictionary = typeof en;

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default as Dictionary),
  pl: () => import("./dictionaries/pl.json").then((m) => m.default as Dictionary),
};

export type Locale = keyof typeof dictionaries;

export const locales = Object.keys(dictionaries) as Locale[];

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (): Promise<Dictionary> => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale]();
};
