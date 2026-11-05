import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Phase 1 placeholder." />
      <Card>
        <p className="text-sm text-muted">System settings will be added in a later phase.</p>
      </Card>
    </div>
  );
}
