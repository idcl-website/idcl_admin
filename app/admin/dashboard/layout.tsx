"use client"
import AsideView from "@/components/dashboard/aside";
import DashboardHeader from "@/components/dashboard/header";
import { Toaster } from "sonner";
import { RequireAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { MobileMenuButton } from "@/components/general/mobile-button";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <RequireAuth>
        <Toaster richColors position="top-center" />
        <MobileMenuButton
          isOpen={mobileMenuOpen}
          toggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <div className="flex min-h-screen p-4">
          <AsideView
            isMobileOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
          <div className={cn(
            "flex-1 overflow-auto",
            "lg:ml-[208px]",
            mobileMenuOpen && "ml-[208px]"
          )}>
            <section className="space-y-6 px-2 md:px-[30px]">
              <DashboardHeader />
              <main>
                {children}
              </main>
            </section>
          </div>
        </div>
      </RequireAuth>
    </>
  );
}