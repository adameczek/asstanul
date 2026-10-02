"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { onLoadingDone } from "@/lib/loading";

gsap.registerPlugin(useGSAP);
const SUBJECT_REFERENCE_SCALE = 2.0;

const CENTER_FRAMES = [
  { src: "/pictures/looking_up.webp", scale: SUBJECT_REFERENCE_SCALE },
  { src: "/pictures/front_1.webp", scale: SUBJECT_REFERENCE_SCALE },
];

const PROFILE_FRAMES = [
  { src: "/pictures/angled.webp", scale: 1.9 },
  { src: "/pictures/right.webp", scale: SUBJECT_REFERENCE_SCALE },
];

const MOUTH_OPEN_FRAME = { src: "/pictures/right_mouth_open.webp", scale: SUBJECT_REFERENCE_SCALE };

const WINK_FRAME = { src: "/pictures/wink.webp", scale: SUBJECT_REFERENCE_SCALE };

const ALL_FRAMES = [...CENTER_FRAMES, ...PROFILE_FRAMES];
const FRAMES = [...ALL_FRAMES, MOUTH_OPEN_FRAME, WINK_FRAME];

const EMERGE_DUR = 1.5;
const FRAME_HOLD = 0.25;
const HAND_OUT_DUR = 0.55;
const PERSON_LEFT_DUR = 0.75;
const TEXT_UNROLL_DUR = 2.25;

const EMERGE_POINT = { x: 20, y: 70 };
const EMERGE_POINT_MOBILE = { x: 50, y: 90 };
const EMERGE_ANGLE = -40;

const FINISH_HOLD = 0.2;
const WINK_DELAY = 0.7;
const WINK_DUR = 1;

const FPS = 5;
const stepEase = (duration: number) =>
  `steps(${Math.max(1, Math.round(duration * FPS))})`;

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const BAYER_4x4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const BAYER_TILE = 16;
const BAYER_CELL = BAYER_TILE / 4;

export default function IntroAnimation() {
  const stageRef = useRef<HTMLDivElement>(null);
  const handLeftRef = useRef<HTMLDivElement>(null);
  const handRightRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cursorGradientRef = useRef<SVGRadialGradientElement>(null);
  const cursorRectRef = useRef<SVGRectElement>(null);

  useGSAP(
    () => {
      const subject = subjectRef.current!;
      const handLeft = handLeftRef.current!;
      const handRight = handRightRef.current!;
      const text = textRef.current!;
      const stage = stageRef.current!;
      const frames = gsap.utils.toArray<HTMLElement>(".subject-frame", subject);
      const isMobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches;
      const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      const subjectFinalLeft = isMobile ? "17vw" : "10vw";
 
      const frameIndexBySrc = new Map(FRAMES.map((f, i) => [f.src, i]));

      const showFrame = (src: string) => {
        const active = frameIndexBySrc.get(src);
        if (active === undefined) {
          throw new Error(`Unknown subject frame: ${src}`);
        }
        frames.forEach((el, i) =>
          gsap.set(el, { visibility: i === active ? "visible" : "hidden" })
        );
      };

      let introDone = false;
      let isWinking = false;
      let winkTimer: gsap.core.Tween | null = null;

      const replayWink = () => {
        if (!introDone || isWinking) return;
        isWinking = true;
        showFrame(WINK_FRAME.src);
        winkTimer = gsap.delayedCall(WINK_DUR, () => {
          showFrame(CENTER_FRAMES[1].src);
          isWinking = false;
        });
      };

      const onSubjectClick = () => replayWink();
      const onSubjectKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          replayWink();
        }
      };
      subject.addEventListener("click", onSubjectClick);
      subject.addEventListener("keydown", onSubjectKeyDown);

      gsap.set(frames, { visibility: "hidden" });
      frames.forEach((el, i) => {
        gsap.set(el, {
          transformOrigin: "50% 100%",
          scale: FRAMES[i].scale,
        });
      });

      if (prefersReducedMotion) {
        gsap.set(subject, {
          left: subjectFinalLeft,
          top: "125%",
          xPercent: -50,
          yPercent: -95,
        });
        gsap.set([handLeft, handRight], { yPercent: 130 });
        gsap.set(text, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1 });
        showFrame(CENTER_FRAMES[1].src);
        introDone = true;
        return () => {
          subject.removeEventListener("click", onSubjectClick);
          subject.removeEventListener("keydown", onSubjectKeyDown);
        };
      }

      gsap.set(subject, { left: "50%", top: "125%", xPercent: -50 });
      let stageRect = stage.getBoundingClientRect();
      const emergePoint = isMobile ? EMERGE_POINT_MOBILE : EMERGE_POINT;
      const mouthX = (emergePoint.x / 100) * stageRect.width;
      const mouthY = (emergePoint.y / 100) * stageRect.height;

      const positionTextAtMouth = () => {
        const textCX = text.offsetLeft + text.offsetWidth / 2;
        const textCY = text.offsetTop + text.offsetHeight / 2;
        gsap.set(text, {
          x: mouthX - textCX,
          y: mouthY - textCY,
          rotation: EMERGE_ANGLE,
          scale: 0,
          autoAlpha: 0,
        });
      };
      positionTextAtMouth();
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (!cancelled) positionTextAtMouth();
      });
      showFrame(CENTER_FRAMES[0].src);

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

      tl.to(subject, {
        yPercent: -95,
        duration: EMERGE_DUR,
        ease: stepEase(EMERGE_DUR),
      });

      for (let i = 1; i < ALL_FRAMES.length; i++) {
        tl.add(() => showFrame(ALL_FRAMES[i].src), `+=${FRAME_HOLD}`);
      }

      tl.to(
        [handLeft, handRight],
        { yPercent: 130, duration: HAND_OUT_DUR, ease: stepEase(HAND_OUT_DUR) },
        "handsOut"
      )
        .add(() => showFrame(PROFILE_FRAMES[0].src), "handsOut")
        .to(
          subject,
          { left: subjectFinalLeft, duration: PERSON_LEFT_DUR, ease: stepEase(PERSON_LEFT_DUR) },
          "handsOut"
        )
        .add(() => showFrame(PROFILE_FRAMES[1].src))
        .addLabel("textOut", `+=${FINISH_HOLD}`)
        .add(() => showFrame(MOUTH_OPEN_FRAME.src), "textOut")
        .to(
          text,
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
            duration: TEXT_UNROLL_DUR,
            ease: "back.inOut",
          },
          "textOut"
        );

      tl.add(() => showFrame(PROFILE_FRAMES[1].src), "+=0.4")
        .add(() => showFrame(PROFILE_FRAMES[0].src), `+=${FINISH_HOLD}`)
        .add(() => showFrame(CENTER_FRAMES[1].src), `+=${FINISH_HOLD}`)
        .add(() => showFrame(WINK_FRAME.src), `+=${WINK_DELAY}`)
        .add(() => showFrame(CENTER_FRAMES[1].src), `+=${WINK_DUR}`)
        .eventCallback("onComplete", () => {
          introDone = true;
        });

      onLoadingDone(() => tl.play());

      const cursorGradient = cursorGradientRef.current!;
      const cursorRect = cursorRectRef.current!;
      const radius = Math.max(180, Math.min(window.innerWidth, window.innerHeight) * 0.3);
      const cursor = { x: -radius * 2, y: -radius * 2 };

      gsap.set(cursorGradient, { attr: { r: radius } });

      const applyCursor = () => {
        cursorGradient.setAttribute("cx", String(cursor.x));
        cursorGradient.setAttribute("cy", String(cursor.y));
      };

      const moveX = gsap.quickTo(cursor, "x", {
        duration: 0.5,
        ease: "power3.out",
        onUpdate: applyCursor,
      });
      const moveY = gsap.quickTo(cursor, "y", {
        duration: 0.5,
        ease: "power3.out",
        onUpdate: applyCursor,
      });
      const setCursorOpacity = gsap.quickTo(cursorRect, "opacity", {
        duration: 0.3,
        ease: "power3.out",
      });

      const onMove = (e: MouseEvent) => {
        moveX(e.clientX - stageRect.left);
        moveY(e.clientY - stageRect.top);
        setCursorOpacity(1);
      };

      const onLeave = () => {
        setCursorOpacity(0);
      };

      const onResize = () => {
        stageRect = stage.getBoundingClientRect();
      };

      stage.addEventListener("mousemove", onMove);
      stage.addEventListener("mouseleave", onLeave);
      window.addEventListener("resize", onResize);

      return () => {
        cancelled = true;
        stage.removeEventListener("mousemove", onMove);
        stage.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("resize", onResize);
        subject.removeEventListener("click", onSubjectClick);
        subject.removeEventListener("keydown", onSubjectKeyDown);
        winkTimer?.kill();
        gsap.killTweensOf(cursor);
        gsap.killTweensOf(cursorRect);
      };
    },
    { scope: stageRef }
  );

  return (
    <div
      ref={stageRef}
      className="relative h-screen w-screen overflow-hidden font-sans"
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ color: "var(--dither-light)" }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="dither-bayer"
            width={BAYER_TILE}
            height={BAYER_TILE}
            patternUnits="userSpaceOnUse"
          >
            {BAYER_4x4.map((v, i) => (
              <rect
                key={i}
                x={(i % 4) * BAYER_CELL}
                y={Math.floor(i / 4) * BAYER_CELL}
                width={BAYER_CELL}
                height={BAYER_CELL}
                fill="currentColor"
                fillOpacity={v / 15}
              />
            ))}
          </pattern>
          <radialGradient id="dither-radial" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <radialGradient
            ref={cursorGradientRef}
            id="dither-cursor"
            gradientUnits="userSpaceOnUse"
            cx="0"
            cy="0"
            r="240"
          >
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="dither-mask">
            <rect width="100%" height="100%" fill="url(#dither-radial)" />
          </mask>
          <mask id="dither-cursor-mask">
            <rect width="100%" height="100%" fill="url(#dither-cursor)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          style={{ fill: "var(--dither-dark)" }}
        />
        <rect
          width="100%"
          height="100%"
          fill="url(#dither-bayer)"
          mask="url(#dither-mask)"
        />
        <rect
          ref={cursorRectRef}
          width="100%"
          height="100%"
          fill="url(#dither-bayer)"
          mask="url(#dither-cursor-mask)"
          style={{ color: "var(--dither-bright)" }}
          opacity="0"
        />
      </svg>

      <div
        ref={handLeftRef}
        className="absolute bottom-0 left-0 z-20"
        style={{ width: "min(34vw, 40vh)", aspectRatio: "878 / 210" }}
      >
        <Image
          src="/pictures/climbing_hand_left.webp"
          alt="Left climbing hand"
          fill
          sizes="34vw"
          className="object-contain"
        />
      </div>

      <div
        ref={handRightRef}
        className="absolute bottom-0 right-0 z-20"
        style={{ width: "min(36vw, 44vh)", aspectRatio: "1053 / 349" }}
      >
        <Image
          src="/pictures/climbing_hand_right.webp"
          alt="Right climbing hand"
          fill
          sizes="36vw"
          className="object-contain"
        />
      </div>

      <div
        ref={subjectRef}
        className="absolute aspect-square w-[min(95vw,85vh)] md:w-[min(60vw,62vh)]"
        style={{ left: "50%", top: "125%" }}
        role="button"
        tabIndex={0}
        aria-label="Wink"
      >
        <div className="absolute inset-0">
          {FRAMES.map((frame) => (
            <div key={frame.src} className="subject-frame absolute inset-0">
              <Image
                src={frame.src}
                alt=""
                fill
                sizes="(max-width: 767px) 95vw, 60vw"
                priority={frame.src === CENTER_FRAMES[0].src}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={textRef}
        className="absolute right-[1vw] top-[20vh] z-40 w-fit md:left-[34vw] md:top-[40vh]"
      >
        <h1 className="text-line font-display block w-fit bg-black px-3 py-1 text-[clamp(2.5rem,9vw,4rem)] font-bold leading-tight tracking-tight text-zinc-50 dark:bg-zinc-50 dark:text-black md:text-[clamp(3.5rem,9vw,7rem)]">
          Adam Sawicki-Stanul
        </h1>
        <h2 className="text-line mt-2 block w-fit bg-black px-3 py-0.5 text-[clamp(1rem,4.5vw,1.5rem)] text-zinc-50 dark:bg-zinc-50 dark:text-black md:text-[clamp(1.25rem,4.5vw,1.75rem)]">
          Software Developer
        </h2>
      </div>

      <div
        className="tv-flicker pointer-events-none absolute inset-0 z-30"
        style={{ mixBlendMode: "overlay", opacity: 0.5 }}
        aria-hidden
      />
    </div>
  );
}
