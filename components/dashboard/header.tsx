"use client"
import { usePathname } from "next/navigation"
import { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
    isMobileOpen: boolean;
    toggleMobileMenu: () => void;
}

export default function DashboardHeader({ isMobileOpen, toggleMobileMenu }: DashboardHeaderProps) {
    const { logout } = useAuth()
    const pathname = usePathname()
    const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; url: string }[]>([])

    useEffect(() => {
        const segments = pathname.split('/').filter(Boolean)
        const isMongoId = (s: string) => /^[a-f\d]{24}$/i.test(s)

        const crumbs = segments
            .filter(s => !isMongoId(s) && isNaN(Number(s)))
            .map((s) => ({
                label: s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                url: '/' + segments.slice(0, segments.indexOf(s) + 1).join('/')
            }))
            .slice(2) // skip "admin/dashboard"

        setBreadcrumbs(crumbs)
    }, [pathname])

    return (
        <header className="h-[60px] shrink-0 bg-white border-b border-gray-100 px-6 flex items-center justify-between">
            {/* Left: mobile toggle + breadcrumb */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMobileMenu}
                    className="lg:hidden h-8 w-8"
                >
                    {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
                </Button>

                <nav className="flex items-center gap-1.5 text-sm">
                    <span className="text-gray-400 font-medium">Dashboard</span>
                    {breadcrumbs.map((crumb, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                            <span className="text-gray-300">/</span>
                            <span className={i === breadcrumbs.length - 1 ? "text-gray-900 font-semibold" : "text-gray-400"}>
                                {crumb.label}
                            </span>
                        </span>
                    ))}
                </nav>
            </div>

            {/* Right: user menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors outline-none">
                        {/* Avatar initials */}
                        <div className="w-7 h-7 rounded-full bg-[#005DFF] flex items-center justify-center shrink-0">
                            <span className="text-white text-[11px] font-semibold">JD</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden sm:block">Jon Doe</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    <div className="px-3 py-2">
                        <p className="text-sm font-medium text-gray-900">Jon Doe</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={logout}
                        className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer gap-2"
                    >
                        <LogOut size={14} />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}