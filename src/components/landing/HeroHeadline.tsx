"use client";

import { usePathname } from "next/navigation";

export function HeroHeadline() {
  const pathname = usePathname();

  return (
    <h1
      key={pathname}
      className="headline-enter max-w-xl text-3xl font-bold leading-tight tracking-tight text-[#0f2a3d] sm:text-4xl lg:text-[2.75rem]"
    >
      Empowering Pakistan&apos;s Workforce
    </h1>
  );
}
