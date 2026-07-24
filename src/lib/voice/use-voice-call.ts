"use client";

/**
 * Browser-side Gemini Live voice call for the marketing site's ungated
 * demo. Adapted from VX1 ghl-agent's usePublicVoiceCall: same audio
 * pipeline, but the token is minted cross-origin by the Xovera app's
 * public voice-demo endpoint (CORS-open, cooldown + hard session cap
 * enforced server-side). Mic → Gemini Live directly; no Twilio.
 *
 * Gated on NEXT_PUBLIC_VOICE_API_BASE (e.g. https://app.xovera.io).
 * When unset, VOICE_DEMO_CONFIGURED is false and callers should show
 * the sample+book-demo fallback instead of the phone.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { GeminiLiveProvider } from "@/lib/voice/gemini-live";
import { MicCapture, PcmPlayer } from "@/lib/voice/audio-client";

const API_BASE = process.env.NEXT_PUBLIC_VOICE_API_BASE?.replace(/\/$/, "");

/** True once the marketing site knows where to mint voice tokens. */
export const VOICE_DEMO_CONFIGURED = Boolean(API_BASE);

export type VoiceCallState = "idle" | "connecting" | "live" | "ended" | "error" | "unavailable";

export interface VoiceCallOptions {
  /** Fired once per call on teardown with how long it ran. */
  onEnded?: (info: { secsUsed: number }) => void;
}

export function useVoiceCall(options: VoiceCallOptions = {}) {
  const [state, setState] = useState<VoiceCallState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const providerRef = useRef<GeminiLiveProvider | null>(null);
  const micRef = useRef<MicCapture | null>(null);
  const playerRef = useRef<PcmPlayer | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const onEndedRef = useRef(options.onEnded);
  onEndedRef.current = options.onEnded;

  const teardown = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      await providerRef.current?.close();
    } catch {}
    micRef.current?.stop();
    playerRef.current?.stop();
    providerRef.current = null;
    micRef.current = null;
    playerRef.current = null;
  }, []);

  const endCall = useCallback(
    async (next: VoiceCallState = "ended") => {
      await teardown();
      setSecondsLeft(null);
      if (startedAtRef.current !== null) {
        const secsUsed = Math.round((Date.now() - startedAtRef.current) / 1000);
        startedAtRef.current = null;
        onEndedRef.current?.({ secsUsed });
      }
      setState(next);
    },
    [teardown],
  );

  const startCall = useCallback(async () => {
    if (!API_BASE) {
      setState("unavailable");
      return;
    }
    setError(null);
    setState("connecting");

    // Pre-flight the mic BEFORE minting a token: getUserMedia is where a
    // denied/dismissed permission prompt throws. Ask first; if the browser
    // says no, nothing server-side is consumed and the visitor can fix the
    // permission and retry immediately.
    try {
      const preflight = await navigator.mediaDevices.getUserMedia({ audio: true });
      preflight.getTracks().forEach((t) => t.stop());
    } catch {
      setError(
        "Your browser blocked the microphone — click the mic icon in the address bar, allow it for this site, and try again.",
      );
      setState("error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/public/voice-demo/web-token`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503) {
        setState("unavailable");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Could not start the voice session.");

      const { connection, tools, vendorConfig, maxSessionSecs } = data;
      startedAtRef.current = Date.now();

      const provider = new GeminiLiveProvider();
      const player = new PcmPlayer();
      await player.start();
      const mic = new MicCapture((chunk: string) => provider.sendAudioChunk(chunk));

      provider.onAudioOutput = (pcm) => player.enqueue(pcm);
      provider.onInterrupted = () => player.flush();
      provider.onToolCall = async () => ({ error: "not available in demo" }); // no real actions in the public demo
      provider.onError = (msg: string) => {
        setError(msg);
        void endCall("error");
      };
      provider.onEnded = () => {
        void endCall("ended");
      };

      await provider.connect({ connection, tools, vendorConfig });
      await mic.start();
      providerRef.current = provider;
      micRef.current = mic;
      playerRef.current = player;

      // "Pick up the phone": Gemini Live's VAD waits for inbound speech,
      // so without a kick the agent sits silent until the caller talks.
      // A completed text turn makes it open with its greeting immediately,
      // like answering a real call.
      provider.nudge("(The caller has just connected. Answer the phone now with your opening greeting.)");

      const cap = Number(maxSessionSecs || connection?.maxSessionSecs || 120);
      setSecondsLeft(cap);
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s === null) return s;
          if (s <= 1) {
            void endCall("ended");
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      setState("live");
    } catch (err) {
      // Mic can still fail here (permission revoked between preflight and
      // capture) — keep the friendly wording for that case too.
      const micDenied =
        err instanceof Error && (err.name === "NotAllowedError" || err.name === "NotFoundError");
      setError(
        micDenied
          ? "Your browser blocked the microphone — click the mic icon in the address bar, allow it for this site, and try again."
          : err instanceof Error
            ? err.message
            : "Voice session failed.",
      );
      micRef.current?.stop();
      playerRef.current?.stop();
      // If the token was already minted (startedAt set) but connect/mic
      // failed, endCall never runs — fire onEnded here so tracking still
      // sees the attempt and the refs don't go stale for the next try.
      if (startedAtRef.current !== null) {
        const secsUsed = Math.round((Date.now() - startedAtRef.current) / 1000);
        startedAtRef.current = null;
        onEndedRef.current?.({ secsUsed });
      }
      setState("error");
    }
  }, [endCall]);

  // Tear down if the component unmounts mid-call.
  useEffect(() => () => void teardown(), [teardown]);

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
    setSecondsLeft(null);
  }, []);

  return { state, error, secondsLeft, startCall, endCall, reset };
}
