"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { useAuth } from "@/lib/auth-store";

export default function OfficerSessionsPage() {
  const { user, users, sessions, completeSession } = useAuth();
  const mine = sessions.filter((s) => s.officerId === user?.id);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [outcome, setOutcome] = useState("");

  return (
    <div>
      <PageHeader
        title="Counselling Sessions"
        subtitle="Conduct scheduled sessions and record feedback."
      />

      <div className="space-y-3">
        {mine.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">No sessions yet. Schedule one from Bookings.</p>
          </Card>
        ) : (
          mine.map((s) => {
            const seeker = users.find((u) => u.id === s.seekerId);
            return (
              <Card
                key={s.id}
                title={`${seeker?.seekerProfile?.fullName || seeker?.email || "Seeker"}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={s.status}
                    tone={s.status === "Completed" ? "success" : "info"}
                  />
                  <span className="text-sm text-muted">
                    {s.scheduledDate} {s.scheduledTime} · {s.mode}
                  </span>
                </div>

                {s.status === "Completed" ? (
                  <div className="mt-3 text-sm text-foreground">
                    <p>
                      <strong>Outcome:</strong> {s.outcome || "—"}
                    </p>
                    <p className="mt-1">
                      <strong>Feedback:</strong> {s.feedback || "—"}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    {activeId === s.id ? (
                      <div className="space-y-3 rounded-lg border border-border p-3">
                        <Input
                          label="Outcome"
                          value={outcome}
                          onChange={(e) => setOutcome(e.target.value)}
                          placeholder="Guidance provided, next steps..."
                        />
                        <label className="block space-y-1.5 text-sm text-foreground">
                          <span className="font-medium">Session Feedback</span>
                          <textarea
                            className="min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                        </label>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              const result = completeSession(s.id, { feedback, outcome });
                              alert(result.message);
                              if (result.ok) {
                                setActiveId(null);
                                setFeedback("");
                                setOutcome("");
                              }
                            }}
                          >
                            Mark Completed
                          </Button>
                          <Button variant="secondary" onClick={() => setActiveId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => setActiveId(s.id)}>Conduct / Complete</Button>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {!user?.placementCenterId ? (
        <div className="mt-4">
          <Alert tone="warning">Assign a placement center in admin to receive bookings.</Alert>
        </div>
      ) : null}
    </div>
  );
}
