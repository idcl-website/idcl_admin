"use client"
import { usePathname } from "next/navigation"
import { useEffect, useState } from 'react'
import user from '@/assets/icons/user.png'
import dropdown from '@/assets/icons/dropdown.svg'
import Image from "next/image"

export default function DashboardHeader() {
    const pathname = usePathname()
    const [currentPath, setCurrentPath] = useState<string>('')

    useEffect(() => {
        const title = pathname.split('/').filter(Boolean)
        const name = title[title.length - 1]
        setCurrentPath(name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
    }, [pathname])

    return (
        <header className="bg-[#fff] w-full h-[50px] rounded-[10px] py-3 px-6 flex justify-between items-center">
            <p className="text-[#1E1E1E] text-[14px] font-bold leading-normal">{currentPath}</p>
            <div className="flex items-center gap-[8px]">
                <Image src={user} alt="user" priority width={23} height={23} />
                <p className="text-[#000] text-[14px] font-bold leading-normal">Jon Doe</p>
                <button>
                    <Image src={dropdown} alt="user" priority width={23} height={23} />
                </button>
            </div>
        </header>
    )
}