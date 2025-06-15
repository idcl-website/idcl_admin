"use client"
import AsideView from "@/components/dashboard/aside";
import DashboardHeader from "@/components/dashboard/header";
import { Toaster } from "sonner";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="flex min-h-screen p-4">
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
    </>
  )
}


