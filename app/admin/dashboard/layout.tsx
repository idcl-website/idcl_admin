"use client"
import AsideView from "@/components/dashboard/aside";
import DashboardHeader from "@/components/dashboard/header";
import { Toaster } from "sonner";
import { RequireAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <RequireAuth>
      <Toaster richColors position="top-center" />
      <div className="flex min-h-screen">
        <AsideView
          isMobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content area */}
        <div className={cn(
          "flex-1 flex flex-col",
          "lg:ml-[208px] md:p-4"
        )}>
          {/* Header container with sticky behavior only on mobile */}
          <div className={cn(
            "md:mt-2 md:ml-4",
            "sticky top-0 z-40 backdrop-blur-sm bg-white/80 sm:bg-transparent sm:backdrop-blur-2", // Mobile styles
            "lg:static" // Remove sticky on desktop
          )}>
            <DashboardHeader
              isMobileOpen={mobileMenuOpen}
              toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>

          <main className="flex-1 overflow-auto p-4 md:p-4">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}