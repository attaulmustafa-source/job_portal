"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-store";

export default function CreateOfficerPage() {
  const router = useRouter();
  const { centers, createOfficer } = useAuth();
  const activeCenters = centers.filter((c) => c.active);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [placementCenterId, setPlacementCenterId] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = createOfficer({
      email,
      password,
      fullName,
      phone,
      placementCenterId,
    });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/admin/officers");
  }

  const missing = [
    !fullName.trim() ? "Full name" : null,
    !phone.trim() ? "Phone" : null,
    !email.trim() ? "Email" : null,
    !password.trim() ? "Password" : null,
    !placementCenterId ? "Placement center" : null,
  ].filter(Boolean);

  return (
    <div>
      <PageHeader
        title="Create Officer"
        subtitle="Add a placement officer and assign them to a center."
        actions={
          <Link href="/admin/officers">
            <Button variant="secondary">← Back</Button>
          </Link>
        }
      />

      <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm sm:p-6">
        <form className="grid gap-5 sm:grid-cols-2" onSubmit={onSubmit}>
          {error ? (
            <div className="sm:col-span-2">
              <Alert tone="danger">{error}</Alert>
            </div>
          ) : null}

          <Input
            label="Full name *"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Phone *"
            placeholder="Enter phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            label="Email *"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password *"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="block space-y-1.5 text-sm text-foreground sm:col-span-2">
            <span className="font-medium">Placement center *</span>
            <select
              className="w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
              value={placementCenterId}
              onChange={(e) => setPlacementCenterId(e.target.value)}
              required
            >
              <option value="">Select placement center</option>
              {activeCenters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="sm:col-span-2 flex flex-col items-end gap-2 pt-2">
            {missing.length ? (
              <p className="text-right text-xs text-[#6b7c99]">Missing: {missing.join(", ")}</p>
            ) : null}
            <div className="flex flex-wrap justify-end gap-2">
              <Link href="/admin/officers">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={missing.length > 0}>
                Create
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
