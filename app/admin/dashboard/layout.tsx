"use client"

import AsideView from "@/components/dashboard/aside";
import DashboardHeader from "@/components/dashboard/header";

const sections = [
  { name: "Overview", href: "/dashboard" },
  { name: "User Activity", href: "/dashboard/user-activity" },
  { name: "Campaign Performance", href: "/dashboard/campaign-performance" },
  { name: "Financials", href: "/dashboard/financials" },
  { name: "Platform Health", href: "/dashboard/platform-health" },
  { name: "Performance Analytics", href: "/dashboard/performance-analytics" },
  { name: "User Feedback", href: "/dashboard/user-feedback" },
  { name: "Marketing Performance", href: "/dashboard/marketing-performance" },
  { name: "Geographic Data", href: "/dashboard/geographic-data" },
  { name: "Compliance", href: "/dashboard/compliance" },
  { name: "Predictive Insights", href: "/dashboard/predictive-insights" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[208px_1fr]">
      <AsideView />
      <section className="space-y-6 px-[30px]">
        <DashboardHeader />
        <main>
          {children}
        </main>
      </section>
    </div>
  )
}


