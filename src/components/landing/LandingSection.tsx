import type { ReactNode } from "react";

/** Phase 2 placeholder section — filled in later phases */
export function LandingSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-b border-[#eef2f7] px-4 py-12 sm:px-6 sm:py-14"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-xl font-semibold text-[#1b2a4a] sm:text-2xl">{title}</h2>
        <div className="mt-4 min-h-[4rem] rounded-lg border border-dashed border-[#d5deed] bg-[#fafbfd] p-4 text-sm text-[#6b7c99]">
          {children || "Content coming in a later phase."}
        </div>
      </div>
    </section>
  );
}
