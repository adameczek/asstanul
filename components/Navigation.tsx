"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About Me" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
] as const;

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

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

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        className="font-display text-zinc-800 dark:text-zinc-100"
      >
        <ul className="hidden items-center justify-end gap-8 px-8 py-6 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`px-1 py-2 text-lg tracking-wide transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                  isActive(href) ? "underline decoration-2 underline-offset-8" : ""
                }`}
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
          aria-label={open ? "Close menu" : "Open menu"}
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
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  ref={href === NAV_LINKS[0].href ? firstLinkRef : undefined}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`block px-2 py-3 text-2xl tracking-wide transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                    isActive(href)
                      ? "underline decoration-2 underline-offset-8"
                      : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
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
