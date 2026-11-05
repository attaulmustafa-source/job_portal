"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import type { UserRole } from "@/lib/types";
import { Breadcrumbs } from "./Breadcrumbs";
import { PageFooter } from "./PageFooter";
import { ScrollToTop } from "./ScrollToTop";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [ready, user, role, router]);

  if (!ready || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <Sidebar
          role={role}
          user={user}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={() => {
            logout();
            router.push("/login");
          }}
        />

        <main
          id="app-main-scroll"
          className="flex min-w-0 flex-1 flex-col overflow-y-auto"
        >
          <TopBar role={role} user={user} onOpenMobile={() => setMobileOpen(true)} />
          <div className="mx-auto w-full max-w-[1400px] flex-1 px-3 py-3 sm:px-4 sm:py-4">
            <Breadcrumbs role={role} />
            {children}
          </div>
          <PageFooter />
        </main>
      </div>
      {/* Outside overflow-hidden so fixed position is never clipped */}
      <ScrollToTop />
    </>
  );
}
