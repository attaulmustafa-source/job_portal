"use client";

import { EmployersList } from "@/components/admin/EmployersList";

export default function AdminPendingEmployersPage() {
  return (
    <EmployersList
      title="Pending Employers"
      subtitle="Employers awaiting approval. Approve or reject each request."
      lockedStatus="pending"
    />
  );
}
