"use client"

import { RequireAuth } from "@/contexts/AuthContext";
import Link from "next/link";

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-900 text-white flex flex-col py-8 px-4">
          <div className="text-2xl font-bold mb-8">Admin Dashboard</div>
          <nav className="flex-1 space-y-2">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="block px-3 py-2 rounded hover:bg-gray-700 transition"
              >
                {section.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 bg-gray-50 p-8 overflow-auto text-black">{children}</main>
      </div>
    </RequireAuth>
  );
}
