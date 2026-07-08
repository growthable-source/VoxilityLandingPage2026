import type { Highlighted } from "@/lib/verticals/types";

/** Renders a two-part heading with one gradient-highlighted fragment. */
export function HL({ value }: { value: Highlighted }) {
  return (
    <>
      {value.before}
      <span className="text-gradient">{value.highlight}</span>
      {value.after ?? ""}
    </>
  );
}
