"use client";

import { EmployersList } from "@/components/admin/EmployersList";

export default function AdminActiveEmployersPage() {
  return (
    <EmployersList
      title="Active Employers"
      subtitle="Approved employers. Post jobs on their behalf or open their profile."
      lockedStatus="approved"
    />
  );
}
