"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Plays a short pre-rendered voice sample (public/voice-ai-sample.mp3) so a
 * visitor can hear what the AI sounds like. Ported from the app workspace's
 * landing components and restyled with the site tokens.
 */
export function VoiceSampleButton({
  src = "/voice-ai-sample.mp3",
}: {
  src?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(src);
    a.preload = "none";
    const onEnded = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    a.addEventListener("ended", onEnded);
    a.addEventListener("pause", onPause);
    a.addEventListener("play", onPlay);
    audioRef.current = a;
    return () => {
      a.pause();
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("play", onPlay);
      audioRef.current = null;
    };
  }, [src]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      className={cn(
        "inline-flex h-12 items-center gap-3 rounded-full border border-border/60 bg-card/70 py-2 pl-2 pr-6",
        "text-[15px] font-medium tracking-tight text-foreground backdrop-blur-sm",
        "transition-smooth hover:border-primary/50 hover:shadow-glow-soft",
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-primary">
        {playing ? (
          <Pause className="h-3.5 w-3.5" strokeWidth={2.5} fill="currentColor" />
        ) : (
          <Play className="ml-0.5 h-3.5 w-3.5" strokeWidth={2.5} fill="currentColor" />
        )}
      </span>
      {playing ? (
        <span className="flex items-center gap-3">
          Playing sample
          <span className="flex h-4 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-primary"
                style={{
                  animation: `voice-bar 0.9s ease-in-out ${i * 0.15}s infinite alternate`,
                }}
              />
            ))}
          </span>
        </span>
      ) : (
        "Hear a sample call"
      )}
    </button>
  );
}
