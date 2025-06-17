"use client"
import { usePathname } from "next/navigation"
import { useEffect, useState } from 'react'
import user from '@/assets/icons/user.png'
import dropdown from '@/assets/icons/dropdown.svg'
import Image from "next/image"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
    isMobileOpen: boolean;
    toggleMobileMenu: () => void;
}

export default function DashboardHeader({ isMobileOpen, toggleMobileMenu }: DashboardHeaderProps) {
    const { logout } = useAuth()
    const pathname = usePathname()
    const [currentPath, setCurrentPath] = useState<string>('')

    useEffect(() => {
        const segments = pathname.split('/').filter(Boolean)


        let displaySegment = segments[segments.length - 1]

        if (!isNaN(Number(displaySegment))) {
            displaySegment = segments[segments.length - 2] || displaySegment
        }

        setCurrentPath(
            displaySegment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        )
    }, [pathname])

    return (
        <header className="bg-[#fff] w-full md:w-[1080px] h-[50px] sm:rounded-[10px] sm:border-none py-3 px-6 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center gap-4">
                {/* Mobile menu button - only visible on small screens */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMobileMenu}
                    className="lg:hidden"
                >
                    {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <p className="text-[#1E1E1E] text-[14px] sm:text-[16px] font-bold leading-normal">
                    {currentPath}
                </p>
            </div>
            <div className="flex items-center gap-[8px]">
                <Image src={user} alt="user" priority width={23} height={23} />
                <p className="text-[#000] text-[14px] font-bold leading-normal">Jon Doe</p>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Image src={dropdown} alt="user" priority width={23} height={23} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>

                        <DropdownMenuItem>
                            <LogOut className="h-4 w-4 mr-2" />
                            <button
                                onClick={() => {
                                    logout();
                                }}
                            >
                                Logout
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}