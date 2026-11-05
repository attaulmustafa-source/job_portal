import type { UserAccount } from "./types";
import { canEmployerPostJobs, employerReadyForApproval } from "./profile";

/** Message when employer tries to post before they are allowed. */
export function employerPostBlockMessage(user?: UserAccount | null): string | null {
  if (!user || user.role !== "employer") return "Not allowed.";
  if (canEmployerPostJobs(user)) return null;

  const status = user.employerApproval || "incomplete";
  if (status === "pending") {
    return "Your account is not approved yet. You will get a notification when an admin approves you.";
  }
  if (status === "rejected") {
    return "Your registration was rejected. Update your organization details and resubmit for approval.";
  }
  if (!employerReadyForApproval(user)) {
    return "Please complete your profile and organization details before posting jobs.";
  }
  return "Please complete your profile and submit for approval before posting jobs.";
}
