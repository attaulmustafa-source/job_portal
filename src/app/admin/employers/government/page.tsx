"use client";

import { EmployersList } from "@/components/admin/EmployersList";

export default function AdminGovernmentEmployersPage() {
  return (
    <EmployersList
      title="Government Employers"
      subtitle="Employers registered under the Government category."
      lockedCategory="Government"
    />
  );
}
