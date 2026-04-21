"use client"
import AsideView from "@/components/dashboard/aside";
import DashboardHeader from "@/components/dashboard/header";
import { Toaster } from "sonner";
import { RequireAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <RequireAuth>
      <Toaster richColors position="top-center" />
      <div className="flex h-screen bg-[#f4f6fb] overflow-hidden">
        <AsideView
          isMobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardHeader
            isMobileOpen={mobileMenuOpen}
            toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          <main className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}