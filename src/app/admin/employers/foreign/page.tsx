"use client";

import { EmployersList } from "@/components/admin/EmployersList";

export default function AdminForeignEmployersPage() {
  return (
    <EmployersList
      title="Foreign Employers"
      subtitle="Employers registered under the Foreign category."
      lockedCategory="Foreign"
    />
  );
}
