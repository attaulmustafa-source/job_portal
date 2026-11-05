"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-store";

export default function RequestCounsellingPage() {
  const router = useRouter();
  const { centers, createBooking } = useAuth();
  const activeCenters = centers.filter((c) => c.active);
  const [centerId, setCenterId] = useState("");
  const [topic, setTopic] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = createBooking({
      centerId,
      topic,
      preferredDate,
      preferredTime,
      notes,
    });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/seeker/counselling");
  }

  const missing = [
    !centerId ? "Placement center" : null,
    !topic.trim() ? "Topic" : null,
    !preferredDate ? "Preferred date" : null,
    !preferredTime ? "Preferred time" : null,
  ].filter(Boolean);

  return (
    <div>
      <PageHeader
        title="Request Counselling"
        subtitle="Submit a counselling request to a placement center."
        actions={
          <Link href="/seeker/counselling">
            <Button variant="secondary">← Back</Button>
          </Link>
        }
      />

      <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm sm:p-6">
        {activeCenters.length === 0 ? (
          <Alert tone="warning">No active placement centers are available right now.</Alert>
        ) : (
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={onSubmit}>
            {error ? (
              <div className="sm:col-span-2">
                <Alert tone="danger">{error}</Alert>
              </div>
            ) : null}

            <label className="block space-y-1.5 text-sm text-foreground sm:col-span-2">
              <span className="font-medium">Placement Center *</span>
              <select
                className="w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                value={centerId}
                onChange={(e) => setCenterId(e.target.value)}
                required
              >
                <option value="">Select center</option>
                {activeCenters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </label>

            <Input
              label="Topic *"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              placeholder="Career guidance, interview prep..."
            />
            <Input
              label="Preferred Date *"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
            />
            <Input
              label="Preferred Time *"
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
            />
            <div className="sm:col-span-2">
              <label className="block space-y-1.5 text-sm text-foreground">
                <span className="font-medium">Notes</span>
                <textarea
                  className="min-h-20 w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
            </div>

            <div className="sm:col-span-2 flex flex-col items-end gap-2 pt-2">
              {missing.length ? (
                <p className="text-right text-xs text-[#6b7c99]">Missing: {missing.join(", ")}</p>
              ) : null}
              <div className="flex flex-wrap justify-end gap-2">
                <Link href="/seeker/counselling">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={missing.length > 0}>
                  Submit Request
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
