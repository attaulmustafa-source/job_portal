"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth-store";

export function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword !== confirm) {
      setError("New password and confirm password do not match.");
      return;
    }
    const result = changePassword({ currentPassword, newPassword });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSuccess(result.message);
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
  }

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-foreground">Change Password</h1>
      <p className="mt-1 text-sm text-muted">
        Update your account password. You will keep your current session.
      </p>

      <form className="mt-6 max-w-md space-y-4" onSubmit={onSubmit}>
        {error ? <Alert tone="danger">{error}</Alert> : null}
        {success ? <Alert tone="success">{success}</Alert> : null}

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Current Password</span>
          <input
            type={show ? "text" : "password"}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">New Password</span>
          <input
            type={show ? "text" : "password"}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Confirm New Password</span>
          <input
            type={show ? "text" : "password"}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
          Show passwords
        </label>

        <Button type="submit">Update Password</Button>
      </form>
    </Card>
  );
}
