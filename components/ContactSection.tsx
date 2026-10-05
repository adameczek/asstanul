"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

const OVERLAP_FRACTION = 0.6;
const EARLY_TRIGGER_FRACTION = 0.3;
const EXIT_DURATION_MS = 450;

const HAND_IMAGE = {
  src: "/pictures/hand.webp",
  width: 1280,
  height: 962,
};

const inputClasses =
  "w-full rounded-lg border border-black bg-transparent px-3 py-2 text-[clamp(1.125rem,2vw,1.5rem)] text-black placeholder-black outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/20 md:px-4 md:py-3";

export default function ContactSection({
  contact,
}: {
  contact: Dictionary["contact"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstImageRef = useRef<HTMLImageElement>(null);

  const [imageCount, setImageCount] = useState(1);
  const [renderCount, setRenderCount] = useState(1);
  const [imageHeight, setImageHeight] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const form = formRef.current;
    const image = firstImageRef.current;

    if (!container || !form || !image) return;

    const measuredImageHeight = image.getBoundingClientRect().height;
    if (measuredImageHeight <= 0) return;

    const formBottom = form.getBoundingClientRect().bottom;
    const containerTop = container.getBoundingClientRect().top;
    const step = measuredImageHeight * (1 - OVERLAP_FRACTION);
    const buffer = measuredImageHeight * EARLY_TRIGGER_FRACTION;

    const count = Math.max(
      1,
      Math.ceil(
        (formBottom - containerTop + buffer - measuredImageHeight) / step,
      ) + 1,
    );

    setImageHeight(measuredImageHeight);
    setImageCount(count);
    setRenderCount((prev) => Math.max(prev, count));
  }, []);

  useLayoutEffect(() => {
    measure();

    const form = formRef.current;
    const image = firstImageRef.current;

    const observer = new ResizeObserver(measure);
    if (form) observer.observe(form);
    if (image) observer.observe(image);

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -80% 0px" },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (imageCount < renderCount) {
      const timer = setTimeout(
        () => setRenderCount(imageCount),
        EXIT_DURATION_MS,
      );
      return () => clearTimeout(timer);
    }
  }, [imageCount, renderCount]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-fixed bg-cover bg-center py-24"
      style={{ backgroundImage: "url('/pictures/contact-background.webp')" }}
    >
      <div className="w-full">
        <div className="flex flex-col items-center gap-12 md:flex-row">
          <div
            ref={containerRef}
            className="contact-slide-left relative order-2 w-full md:order-1 md:w-[70%]"
          >
            <div className="flex flex-col">
              {Array.from({ length: renderCount }).map((_, index) => {
                const exiting = index >= imageCount;
                const slideClass =
                  index === 0
                    ? ""
                    : exiting
                      ? " contact-hand-slide-out"
                      : " contact-hand-slide-in";

                return (
                  <Image
                    key={index}
                    ref={index === 0 ? firstImageRef : undefined}
                    src={HAND_IMAGE.src}
                    alt=""
                    width={HAND_IMAGE.width}
                    height={HAND_IMAGE.height}
                    sizes="(max-width: 767px) 100vw, 70vw"
                    className={`h-auto w-full${slideClass}`}
                    style={{
                      position: "relative",
                      zIndex: imageCount - index,
                      ...(index === 0
                        ? {}
                        : { marginTop: -(imageHeight * OVERLAP_FRACTION) }),
                    }}
                  />
                );
              })}
            </div>
            <form
              ref={formRef}
              style={{ zIndex: imageCount + 1 }}
              className="font-handwriting absolute inset-x-0  top-5 sm:top-10 md:top-10 xl:top-50 mx-auto flex w-[60%] flex-col justify-start gap-4 p-6 md:p-10">
              <label className="flex flex-col gap-1 text-[clamp(1.25rem,2.5vw,1.75rem)] text-black">
                {contact.email}
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={contact.emailPlaceholder}
                  className={inputClasses}
                />
              </label>
              <label className="flex flex-col gap-1 text-[clamp(1.25rem,2.5vw,1.75rem)] text-black">
                {contact.title}
                <input
                  type="text"
                  name="title"
                  required
                  placeholder={contact.titlePlaceholder}
                  className={inputClasses}
                />
              </label>
              <label className="flex flex-col gap-1 text-[clamp(1.25rem,2.5vw,1.75rem)] text-black">
                {contact.description}
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder={contact.descriptionPlaceholder}
                  className={inputClasses}
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-fit rounded-lg border border-black bg-transparent px-6 py-2 text-[clamp(1.125rem,2vw,1.375rem)] text-black transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {contact.send}
              </button>
            </form>
          </div>

          <div
            className={`relative order-1 w-full transition-all duration-700 ease-out motion-reduce:transition-none md:fixed md:top-32 md:right-0 md:w-[30%] ${
              isSectionVisible
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-full opacity-0"
            }`}
          >
            <div className="relative h-[560px] w-full md:h-[1040px] lg:h-[1160px]">
              <Image
                src="/pictures/waitress.webp"
                alt={contact.waitressAlt}
                fill
                sizes="(max-width: 767px) 100vw, 30vw"
                className="object-contain"
              />
              <div className="contact-bubble absolute right-[2%] top-[6%] max-w-[240px]">
                <div className="relative rounded-2xl bg-zinc-50 p-4 text-sm leading-snug text-zinc-900 shadow-lg dark:bg-zinc-900 dark:text-zinc-50">
                  <span
                    aria-hidden
                    className="absolute -left-2 top-8 h-4 w-4 rotate-45 bg-zinc-50 dark:bg-zinc-900"
                  />
                  {contact.bubble}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
