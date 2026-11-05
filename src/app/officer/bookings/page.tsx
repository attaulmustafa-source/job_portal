"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { useAuth } from "@/lib/auth-store";
import type { CounsellingSession } from "@/lib/types";

function bookingTone(status: string) {
  if (status === "Completed" || status === "Approved" || status === "Scheduled") return "success" as const;
  if (status === "Pending") return "warning" as const;
  if (status === "Rejected" || status === "Cancelled") return "danger" as const;
  return "neutral" as const;
}

export default function OfficerBookingsPage() {
  const { user, users, bookings, reviewBooking, scheduleSession } = useAuth();
  const centerBookings = bookings.filter((b) => b.centerId === user?.placementCenterId);
  const [scheduleFor, setScheduleFor] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [mode, setMode] = useState<CounsellingSession["mode"]>("In-person");
  const [rejectReason, setRejectReason] = useState("");

  if (!user?.placementCenterId) {
    return (
      <div>
        <PageHeader title="Booking Requests" />
        <Alert tone="warning">You are not assigned to a placement center.</Alert>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Booking Requests"
        subtitle="Approve/reject requests, then schedule counselling sessions."
      />

      <div className="space-y-3">
        {centerBookings.length === 0 ? (
          <EmptyState
            title="No booking requests"
            description="Counselling booking requests for your center will show up here."
          />
        ) : (
          centerBookings.map((b) => {
            const seeker = users.find((u) => u.id === b.seekerId);
            return (
              <Card key={b.id} title={b.topic}>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge label={b.status} tone={bookingTone(b.status)} />
                  <span className="text-sm text-foreground">
                    {seeker?.seekerProfile?.fullName || seeker?.email}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  Preferred: {b.preferredDate} {b.preferredTime}
                </p>
                {b.notes ? <p className="mt-1 text-sm text-muted">{b.notes}</p> : null}

                {b.status === "Pending" ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        const result = reviewBooking(b.id, "Approved");
                        alert(result.message);
                      }}
                    >
                      Approve
                    </Button>
                    <div className="flex flex-wrap items-end gap-2">
                      <Input
                        label="Rejection reason"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      <Button
                        variant="danger"
                        onClick={() => {
                          const result = reviewBooking(b.id, "Rejected", rejectReason);
                          alert(result.message);
                          setRejectReason("");
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ) : null}

                {(b.status === "Approved" || b.status === "Pending") && (
                  <div className="mt-4">
                    {scheduleFor === b.id ? (
                      <div className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2">
                        <Input
                          label="Session Date"
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          required
                        />
                        <Input
                          label="Session Time"
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          required
                        />
                        <label className="block space-y-1.5 text-sm text-foreground">
                          <span className="font-medium">Mode</span>
                          <select
                            className="w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                            value={mode}
                            onChange={(e) =>
                              setMode(e.target.value as CounsellingSession["mode"])
                            }
                          >
                            <option>In-person</option>
                            <option>Online</option>
                            <option>Phone</option>
                          </select>
                        </label>
                        <div className="flex items-end gap-2">
                          <Button
                            onClick={() => {
                              if (b.status === "Pending") {
                                reviewBooking(b.id, "Approved");
                              }
                              const result = scheduleSession({
                                bookingId: b.id,
                                scheduledDate,
                                scheduledTime,
                                mode,
                              });
                              alert(result.message);
                              if (result.ok) {
                                setScheduleFor(null);
                                setScheduledDate("");
                                setScheduledTime("");
                              }
                            }}
                          >
                            Confirm Schedule
                          </Button>
                          <Button variant="secondary" onClick={() => setScheduleFor(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : b.status === "Approved" || b.status === "Pending" ? (
                      <Button variant="secondary" onClick={() => setScheduleFor(b.id)}>
                        Schedule Session
                      </Button>
                    ) : null}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
