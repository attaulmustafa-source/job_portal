import { AppShell } from "@/components/layout/AppShell";

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="seeker">{children}</AppShell>;
}
