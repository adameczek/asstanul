"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";

const NAV_ITEMS = [
  { path: "", key: "home" },
  { path: "/about-me", key: "aboutMe" },
  { path: "/contact", key: "contact" },
  { path: "/blog", key: "blog" },
  { path: "/gallery", key: "gallery" },
] as const;

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "pl", label: "PL" },
] as const;

export default function Navigation({
  navigation,
}: {
  navigation: Dictionary["navigation"];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const segments = pathname.split("/");
  const locale = segments[1] === "pl" ? "pl" : "en";
  const rest = pathname.slice(3);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const hrefFor = (path: string) => `/${locale}${path}`;

  const isActive = (path: string) => {
    const full = hrefFor(path);
    if (path === "") return pathname === full;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    firstLinkRef.current?.focus();

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = original;
    };
  }, [open]);

  const linkClass = (active: boolean) =>
    `px-1 py-2 text-lg tracking-wide transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 ${
      active ? "underline decoration-2 underline-offset-8" : ""
    }`;

  const mobileLinkClass = (active: boolean) =>
    `block px-2 py-3 text-2xl tracking-wide transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 ${
      active ? "underline decoration-2 underline-offset-8" : ""
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        className="font-display text-zinc-800 dark:text-zinc-100"
      >
        <ul className="hidden items-center justify-end gap-8 px-8 py-6 md:flex">
          {NAV_ITEMS.map(({ path, key }) => (
            <li key={key}>
              <Link
                href={hrefFor(path)}
                aria-current={isActive(path) ? "page" : undefined}
                className={linkClass(isActive(path))}
              >
                {navigation[key]}
              </Link>
            </li>
          ))}
          <li aria-hidden className="text-zinc-400">/</li>
          {LOCALES.map(({ code, label }) => (
            <li key={code}>
              <Link
                href={`/${code}${rest}`}
                aria-current={code === locale ? "page" : undefined}
                className={linkClass(code === locale)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? navigation.closeMenu : navigation.openMenu}
          onClick={() => setOpen((v) => !v)}
          className="absolute right-4 top-4 z-[60] flex h-12 w-12 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 md:hidden"
        >
          <span
            className={`absolute h-0.5 w-6 bg-current transition-all duration-300 motion-reduce:transition-none ${
              open ? "rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-current transition-all duration-300 motion-reduce:transition-none ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-current transition-all duration-300 motion-reduce:transition-none ${
              open ? "-rotate-45" : "translate-y-2"
            }`}
          />
        </button>

        <div
          id="mobile-menu"
          inert={!open}
          className={`fixed right-0 top-0 z-40 h-full w-72 max-w-[85vw] bg-background shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <ul className="flex flex-col gap-2 px-6 pt-24">
            {NAV_ITEMS.map(({ path, key }) => (
              <li key={key}>
                <Link
                  href={hrefFor(path)}
                  ref={key === NAV_ITEMS[0].key ? firstLinkRef : undefined}
                  aria-current={isActive(path) ? "page" : undefined}
                  className={mobileLinkClass(isActive(path))}
                >
                  {navigation[key]}
                </Link>
              </li>
            ))}
            <li className="mt-4 flex gap-6">
              {LOCALES.map(({ code, label }) => (
                <Link
                  key={code}
                  href={`/${code}${rest}`}
                  aria-current={code === locale ? "page" : undefined}
                  className={mobileLinkClass(code === locale)}
                >
                  {label}
                </Link>
              ))}
            </li>
          </ul>
        </div>
      </nav>

      <div
        aria-hidden="true"
        hidden={!open}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-30 bg-black/40 md:hidden"
      />
    </header>
  );
}
