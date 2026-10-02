"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { markLoadingDone } from "@/lib/loading";

gsap.registerPlugin(useGSAP);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const SWEEP_DUR = 2.5;

// Arm geometry — a vertical arm anchored at its bottom-center, rising from below the screen.
const ARM_HEIGHT = "150vh"; // arm image height (width follows from aspect ratio)
const ARM_BASE_BOTTOM = "-80vh"; // anchor offset below the bottom edge (negative = off-screen down)
const ARM_ROTATION = -45; // fixed tilt of the arm, degrees clockwise around the bottom-middle anchor
const ARM_OFFSET_X = -30; // fixed horizontal nudge applied before the sweep (px)
const ARM_OFFSET_Y = -50; // fixed vertical nudge applied before the sweep (px)
const SWEEP_X = 2.4; // arm travel: × viewport width, moving right
const SWEEP_Y = -1.1; // arm travel: × viewport height, moving up
const SWEEP_X_MOBILE = 3.7; // mobile arm travel: × viewport width (tune me)
const SWEEP_Y_MOBILE = -0.8; // mobile arm travel: × viewport height (tune me)
const SWEEP_ANGLE = 45; // manual sweep direction in degrees (0 = up, 90 = right); reveal edge is perpendicular to this

const waitForLoad = () =>
  Promise.all([
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) =>
          window.addEventListener("load", () => resolve(), { once: true })
        ),
    document.fonts.ready,
  ]);

export default function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const armRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const cover = coverRef.current!;
      const text = textRef.current!;
      const arm = armRef.current!;
      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const isMobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches;
      const sweepX = isMobile ? SWEEP_X_MOBILE : SWEEP_X;
      const sweepY = isMobile ? SWEEP_Y_MOBILE : SWEEP_Y;

      const parseVh = (value: string) => (parseFloat(value) / 100) * viewportH;
      const anchorBaseX = 0;
      const anchorBaseY = viewportH - parseVh(ARM_BASE_BOTTOM);
      const theta = (SWEEP_ANGLE * Math.PI) / 180;
      const dirX = Math.sin(theta);
      const dirY = -Math.cos(theta);
      const gradientLength =
        Math.abs(viewportW * Math.sin(theta)) + Math.abs(viewportH * Math.cos(theta));
      const centerX = viewportW / 2;
      const centerY = viewportH / 2;

      gsap.set(arm, { xPercent: -50, rotation: ARM_ROTATION, autoAlpha: 0 });

      let cancelled = false;
      let sweep: gsap.core.Timeline | null = null;

      waitForLoad().then(() => {
        if (cancelled) return;

        if (reduced) {
          gsap.to(cover, {
            autoAlpha: 0,
            duration: 0.3,
            onComplete: () => {
              setDone(true);
              markLoadingDone();
            },
          });
          return;
        }

        const proxy = { p: 0 };
        const apply = () => {
          const p = proxy.p;
          const anchorX = anchorBaseX + ARM_OFFSET_X + p * viewportW * sweepX;
          const anchorY = anchorBaseY + ARM_OFFSET_Y + p * viewportH * sweepY;
          const t = Math.max(
            0,
            Math.min(
              1,
              0.5 +
                ((anchorX - centerX) * dirX + (anchorY - centerY) * dirY) /
                  gradientLength
            )
          );
          const mask = `linear-gradient(${SWEEP_ANGLE}deg, transparent 0%, transparent ${t * 100}%, #000 ${t * 100}%, #000 100%)`;
          gsap.set(arm, {
            x: ARM_OFFSET_X + p * viewportW * sweepX,
            y: ARM_OFFSET_Y + p * viewportH * sweepY,
          });
          cover.style.maskImage = mask;
          cover.style.webkitMaskImage = mask;
        };
        apply();

        sweep = gsap
          .timeline()
          .to(text, { autoAlpha: 0, duration: 0.3, ease: "power1.out" })
          .set(arm, { autoAlpha: 1 })
          .to(proxy, {
            p: 1,
            duration: SWEEP_DUR,
            ease: "power3.inOut",
            onUpdate: apply,
          })
          .to(arm, { autoAlpha: 0, duration: 0.25, ease: "power1.in" })
          .add(() => {
            setDone(true);
            markLoadingDone();
          });
      });

      return () => {
        cancelled = true;
        sweep?.kill();
      };
    },
    { scope: rootRef }
  );

  if (done) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] overflow-hidden">
      <div
        ref={coverRef}
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <p
          ref={textRef}
          className="font-display text-5xl font-bold tracking-tight md:text-7xl"
        >
          Loading
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </p>
      </div>

      <div
        ref={armRef}
        className="pointer-events-none absolute z-20"
        style={{
          height: ARM_HEIGHT,
          aspectRatio: "491 / 1601",
          left: "0%",
          bottom: ARM_BASE_BOTTOM,
          transformOrigin: "50% 100%",
          opacity: 0,
          visibility: "hidden",
        }}
      >
        <Image
          src="/pictures/arm.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
