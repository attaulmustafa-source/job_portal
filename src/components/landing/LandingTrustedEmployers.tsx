"use client";

import Image from "next/image";
import { useState } from "react";
import { RevealHeading } from "@/components/landing/RevealHeading";

type EmployerCategory = "Government" | "Private" | "Overseas";

type TrustedEmployer = {
  id: string;
  name: string;
  category: EmployerCategory;
  logo: string;
};

const EMPLOYERS: TrustedEmployer[] = [
  {
    id: "gov-navttc",
    name: "National Vocational And Technical Training Commission",
    category: "Government",
    logo: "/landing/employers/navttc-full.png",
  },
  {
    id: "gov-pac",
    name: "PAKISTAN AERONAUTICAL COMPLEX KAMRA",
    category: "Government",
    logo: "/landing/employers/pac.png",
  },
  {
    id: "gov-lesco",
    name: "LESCO",
    category: "Government",
    logo: "/landing/employers/lesco.svg",
  },
  {
    id: "gov-coe",
    name: "Navttc Centre of Excellence",
    category: "Government",
    logo: "/landing/employers/coe.svg",
  },
  {
    id: "gov-qasp",
    name: "Quaid-e-Azam Solar Power (Pvt) Ltd",
    category: "Government",
    logo: "/landing/employers/qasp.svg",
  },
  {
    id: "gov-wapda",
    name: "WAPDA",
    category: "Government",
    logo: "/landing/employers/wapda.png",
  },
  {
    id: "gov-pia",
    name: "Pakistan International Airlines",
    category: "Government",
    logo: "/landing/employers/pia.png",
  },
  {
    id: "gov-sngpl",
    name: "Sui Northern Gas Pipelines Limited",
    category: "Government",
    logo: "/landing/employers/sngpl.png",
  },
  {
    id: "gov-ogdcl",
    name: "Oil & Gas Development Company Limited",
    category: "Government",
    logo: "/landing/employers/ogdcl.svg",
  },
  {
    id: "gov-ntdc",
    name: "National Transmission & Despatch Company",
    category: "Government",
    logo: "/landing/employers/ntdc.svg",
  },
  {
    id: "pri-hbl",
    name: "Habib Bank Limited (HBL)",
    category: "Private",
    logo: "/landing/employers/hbl.svg",
  },
  {
    id: "pri-engro",
    name: "Engro Corporation",
    category: "Private",
    logo: "/landing/employers/engro.png",
  },
  {
    id: "pri-jazz",
    name: "Jazz",
    category: "Private",
    logo: "/landing/employers/jazz.png",
  },
  {
    id: "pri-systems",
    name: "Systems Limited",
    category: "Private",
    logo: "/landing/employers/systems.svg",
  },
  {
    id: "pri-nestle",
    name: "Nestlé Pakistan",
    category: "Private",
    logo: "/landing/employers/nestle.png",
  },
  {
    id: "pri-unilever",
    name: "Unilever Pakistan",
    category: "Private",
    logo: "/landing/employers/unilever.png",
  },
  {
    id: "pri-meezan",
    name: "Meezan Bank",
    category: "Private",
    logo: "/landing/employers/meezan.png",
  },
  {
    id: "pri-packages",
    name: "Packages Limited",
    category: "Private",
    logo: "/landing/employers/packages.svg",
  },
  {
    id: "pri-ptcl",
    name: "PTCL",
    category: "Private",
    logo: "/landing/employers/ptcl.png",
  },
  {
    id: "ovr-aramco",
    name: "Saudi Aramco",
    category: "Overseas",
    logo: "/landing/employers/aramco.png",
  },
  {
    id: "ovr-emirates",
    name: "Emirates",
    category: "Overseas",
    logo: "/landing/employers/emirates.png",
  },
  {
    id: "ovr-qatar",
    name: "Qatar Airways",
    category: "Overseas",
    logo: "/landing/employers/qatar.svg",
  },
  {
    id: "ovr-adnoc",
    name: "ADNOC",
    category: "Overseas",
    logo: "/landing/employers/adnoc.svg",
  },
  {
    id: "ovr-dpworld",
    name: "DP World",
    category: "Overseas",
    logo: "/landing/employers/dpworld.svg",
  },
  {
    id: "ovr-samsung",
    name: "Samsung",
    category: "Overseas",
    logo: "/landing/employers/samsung.png",
  },
  {
    id: "ovr-huawei",
    name: "Huawei",
    category: "Overseas",
    logo: "/landing/employers/huawei.png",
  },
];

const TABS: EmployerCategory[] = ["Government", "Private", "Overseas"];

export function LandingTrustedEmployers() {
  const [tab, setTab] = useState<EmployerCategory>("Government");
  const list = EMPLOYERS.filter((e) => e.category === tab);

  return (
    <section
      id="employers"
      className="scroll-mt-20 border-b border-[#eef2f7] bg-white px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
            Trusted by leading employers
          </RevealHeading>
          <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
            Organizations hiring through the NAVTTC Job Portal.
          </p>
        </div>

        <div
          className="mx-auto mt-8 flex max-w-lg items-center justify-center gap-1 rounded-lg border border-[#e5ebf5] bg-[#f3f5f9] p-1"
          role="tablist"
          aria-label="Employer categories"
        >
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[#2f4d9a] !text-white shadow-sm"
                    : "text-[#5b6b85] hover:bg-white hover:text-[#1b2a4a]"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {list.map((emp) => (
            <article
              key={emp.id}
              className="flex flex-col items-center rounded-2xl border border-[#e5ebf5] bg-[#f8fafc] px-4 py-6 text-center transition duration-200 hover:-translate-y-1 hover:border-[#2f4d9a]/35 hover:bg-white hover:shadow-sm"
            >
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-[#e5ebf5] bg-white p-2">
                {emp.logo.endsWith(".svg") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={emp.logo} alt="" className="h-12 w-12 object-contain" />
                ) : (
                  <Image
                    src={emp.logo}
                    alt=""
                    width={56}
                    height={56}
                    className="h-12 w-12 object-contain"
                  />
                )}
              </div>
              <h3 className="mt-4 text-sm font-semibold leading-snug text-[#1b2a4a]">
                {emp.name}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
