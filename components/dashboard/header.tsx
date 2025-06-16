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


export default function DashboardHeader() {
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
        <header className="bg-[#fff] w-full h-[50px] rounded-[10px] py-3 px-6 flex justify-between items-center">
            <p className="text-[#1E1E1E] text-[14px] font-bold leading-normal">{currentPath}</p>
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