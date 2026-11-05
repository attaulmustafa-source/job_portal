"use client";

import { EmployersList } from "@/components/admin/EmployersList";

export default function AdminPrivateEmployersPage() {
  return (
    <EmployersList
      title="Private Employers"
      subtitle="Employers registered under the Private category."
      lockedCategory="Private"
    />
  );
}
