import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";

export default function EmployerSettingsPage() {
  return (
    <div>
      <PageHeader title="Account Settings" subtitle="Phase 1 placeholder." />
      <Card>
        <p className="text-sm text-muted">Employer accounts stay separate from job seeker accounts.</p>
      </Card>
    </div>
  );
}
