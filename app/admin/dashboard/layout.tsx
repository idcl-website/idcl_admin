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
    <RequireAuth>
      <Toaster richColors position="top-center" />
      <MobileMenuButton
        isOpen={mobileMenuOpen}
        toggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      <div className="flex min-h-screen lg:p-4"> {/* Added lg padding */}
        <AsideView
          isMobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        {/* Main content area */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          "lg:ml-[224px] space-y-4 p-4 " // Added right padding on desktop
        )}>
          <DashboardHeader />
          <main className="flex-1 overflow-auto lg:rounded-[10px]">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}