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
      <div className="flex h-screen p-4 gap-4">
        <AsideView
          isMobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content area */}
        <div className={cn(
          "flex-1 flex flex-col",
          // "lg:ml-[208px] md:p-4"
        )}>
          {/* Header container with sticky behavior only on mobile */}
          <div className={cn(
            "md:mt-2",
            "sticky pb-4 top-0 z-20 backdrop-blur-sm bg-white/80 sm:bg-transparent sm:backdrop-blur-2", // Mobile styles
            "lg:static" // Remove sticky on desktop
          )}>
            <DashboardHeader
              isMobileOpen={mobileMenuOpen}
              toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>

          <main className="flex-1 overflow-y-auto py-4 md:py-4 pr-2">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}