"use client"
import AsideView from "@/components/dashboard/aside";
import DashboardHeader from "@/components/dashboard/header";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AsideView />
      <div className="flex-1 overflow-auto ml-[208px]">
        <section className="space-y-6 px-[30px]">
          <DashboardHeader />
          <main>
            {children}
          </main>
        </section>
      </div>
    </div>
  )
}


