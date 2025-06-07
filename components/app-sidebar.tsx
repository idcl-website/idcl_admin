import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import startup from '@/assets/icons/startup.svg'
import talent from '@/assets/icons/talent.svg'
import Link from "next/link"
import Image from "next/image"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import AppLogo from "./general/logo"
import DashboardLogo from "./general/dashlogo"

// Menu items.
const items = [
    {
        title: "Start-up",
        url: "#",
        src: talent,
    },
    {
        title: "Talent",
        url: "#",
        src: startup,
    },

]

export function AppSidebar() {
    return (
        <Sidebar className="border-none fixed top-[30px] left-[28px] rounded-[10px]">
            <SidebarContent>
                <SidebarGroup className="py-[26px] px-[15px] flex flex-col items-start gap-[179px]">
                    <SidebarGroupLabel>
                        <DashboardLogo />
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="w-full flex flex-col items-start gap-[14px]">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} className="w-full bg-[#005DFF] flex py-[9px] px-[16px] items-center gap-[10px] rounded-[9px]">
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <div className="w-[17px] h-[17px]">
                                                <Image
                                                    src={item.src}
                                                    alt="Logo"
                                                    className="object-contain"
                                                    priority
                                                />
                                            </div>
                                            <span className="font-semibold text-[14px] leading-normal text-[#fff]">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}