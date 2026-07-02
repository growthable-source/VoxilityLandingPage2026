"use client";

import { useEffect, useRef } from "react";

/**
 * Background video for the /ai-for-gyms hero. A client component because
 * React omits the `muted` attribute from SSR HTML, which makes browsers
 * block autoplay before hydration — so we set it imperatively and retry
 * play(). Falls back to the poster (rendered behind it by the page) when
 * playback is blocked or reduced motion is preferred.
 */
export function GymHeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.muted = true;
    video.play().catch(() => {
      /* poster remains visible */
    });
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/landing/gym-hero-poster.jpg"
      aria-hidden
    >
      <source src="/landing/gym-hero.mp4" type="video/mp4" />
    </video>
  );
}
