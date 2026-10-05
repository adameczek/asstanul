import Link from "next/link";
import { lang } from "next/root-params";
import { getDictionary } from "@/lib/i18n";

export default async function ModeSwitch({ mode }: { mode?: string }) {
  const dict = await getDictionary();
  const locale = await lang();
  const base = `/${locale}/about-me`;
  const active = mode === "professional" ? "professional" : "casual";

  const modes = [
    { href: `${base}?mode=professional`, label: dict.modeSwitch.professional, value: "professional" },
    { href: `${base}?mode=casual`, label: dict.modeSwitch.casual, value: "casual" },
  ] as const;

  return (
    <div className="fixed left-8 top-6 z-50 font-display text-zinc-800 dark:text-zinc-100">
      <ul className="flex items-center gap-8">
        {modes.map(({ href, label, value }) => {
          const isActive = value === active;
          return (
            <li key={value}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`px-1 py-2 text-lg tracking-wide transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                  isActive ? "underline decoration-2 underline-offset-8" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
