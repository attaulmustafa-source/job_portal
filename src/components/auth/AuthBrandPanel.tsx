import Image from "next/image";

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
        fill="currentColor"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Left blue brand panel — same copy/layout as NAVTTC AMS login */
export function AuthBrandPanel() {
  return (
    <div className="flex h-full min-h-[640px] flex-col bg-[#2f4d9a] px-9 py-10 text-white">
      {/* Logo */}
      <div className="mx-auto mb-5 flex h-[78px] w-[78px] items-center justify-center overflow-hidden rounded-[10px] bg-white shadow-sm">
        <Image
          src="/navttc-logo.png"
          alt="NAVTTC"
          width={78}
          height={78}
          className="h-full w-full object-contain p-1"
          priority
        />
      </div>

      {/* Welcome + Urdu */}
      <h2 className="text-center text-[22px] font-semibold leading-[1.35]">
        Welcome to NAVTTC Job Portal Management System
      </h2>
      <p className="mt-2 text-center text-[15px] leading-relaxed text-white" dir="rtl" lang="ur">
        این اے وی ٹی ٹی سی جاب پورٹل مینجمنٹ سسٹم میں خوش آمدید
      </p>

      {/* Mission paragraph */}
      <p className="mx-auto mt-6 max-w-[430px] text-center text-[13px] leading-[1.65] text-white/95">
        Our mission is to provide direction, support and an enabling environment to the public and
        private sectors to attain a quality skills workforce that meets the national and
        international labour market needs for an economically competitive Pakistan.
      </p>

      {/* Contact cards + footer */}
      <div className="mt-auto space-y-3 pt-12">
        <div className="flex items-start gap-3 rounded-lg border border-white/40 bg-transparent px-4 py-3.5">
          <span className="mt-0.5 shrink-0 opacity-95">
            <PhoneIcon />
          </span>
          <div>
            <p className="text-[14px] font-medium leading-snug">
              Need help? Call us at{" "}
              <span className="font-semibold text-[#f9a825]">0800-88866</span>
            </p>
            <p className="mt-1 text-[12px] text-white/85">Available 9AM – 5PM (Mon–Fri)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-white/40 bg-transparent px-4 py-3.5">
          <span className="shrink-0 opacity-95">
            <EmailIcon />
          </span>
          <p className="text-[14px] font-medium leading-snug">
            Email us at{" "}
            <span className="font-semibold text-[#f9a825]">info.reg@navttc.gov.pk</span>
          </p>
        </div>

        <p className="pt-4 text-center text-[12px] text-white/90">
          NAVTTC - Job Portal
        </p>
      </div>
    </div>
  );
}
