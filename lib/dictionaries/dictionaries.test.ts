import { describe, expect, it } from "vitest";
import en from "./en.json";
import pl from "./pl.json";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function collectKeys(value: unknown, prefix = ""): string[] {
  if (!isObject(value)) return prefix ? [prefix] : [];
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return collectKeys(child, path);
  });
}

describe("dictionary keys", () => {
  const enKeys = collectKeys(en);
  const plKeys = new Set(collectKeys(pl));

  it("pl.json contains every key from en.json", () => {
    const missing = enKeys.filter((key) => !plKeys.has(key));
    if (missing.length > 0) {
      console.log(`\nMissing keys in pl.json:\n${missing.sort().map((key) => `  - ${key}`).join("\n")}\n`);
    }
    expect(missing).toEqual([]);
  });

  it("pl.json contains no keys that are missing from en.json", () => {
    const enKeySet = new Set(enKeys);
    const extra = [...plKeys].filter((key) => !enKeySet.has(key));
    if (extra.length > 0) {
      console.log(`\nUnexpected keys in pl.json:\n${extra.sort().map((key) => `  - ${key}`).join("\n")}\n`);
    }
    expect(extra).toEqual([]);
  });
});
