import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";

export default function SeekerSettingsPage() {
  return (
    <div>
      <PageHeader title="Account Settings" subtitle="Phase 1 placeholder." />
      <Card>
        <p className="text-sm text-muted">
          Job seekers cannot convert this account into an employer account.
        </p>
      </Card>
    </div>
  );
}
