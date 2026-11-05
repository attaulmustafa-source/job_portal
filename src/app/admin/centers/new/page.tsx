"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-store";

export default function CreateCenterPage() {
  const router = useRouter();
  const { createCenter } = useAuth();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = createCenter({ name, city, address, phone, active });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/admin/centers");
  }

  const missing = [
    !name.trim() ? "Center name" : null,
    !city.trim() ? "City" : null,
    !phone.trim() ? "Phone" : null,
    !address.trim() ? "Address" : null,
  ].filter(Boolean);

  return (
    <div>
      <PageHeader
        title="Create Center"
        subtitle="Add a placement center for counselling and officer assignment."
        actions={
          <Link href="/admin/centers">
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
            label="Center name *"
            placeholder="Enter center name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="City *"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <Input
            label="Phone *"
            placeholder="Enter phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <label className="block space-y-1.5 text-sm text-foreground">
            <span className="font-medium">Status *</span>
            <select
              className="w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
              value={active ? "Active" : "In-Active"}
              onChange={(e) => setActive(e.target.value === "Active")}
            >
              <option>Active</option>
              <option>In-Active</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <Input
              label="Address *"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-2 flex flex-col items-end gap-2 pt-2">
            {missing.length ? (
              <p className="text-right text-xs text-[#6b7c99]">Missing: {missing.join(", ")}</p>
            ) : null}
            <div className="flex flex-wrap justify-end gap-2">
              <Link href="/admin/centers">
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
