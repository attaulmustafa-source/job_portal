"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Organization fields live under Employer Profile now. */
export default function EmployerOrganizationRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/employer/profile");
  }, [router]);
  return null;
}
