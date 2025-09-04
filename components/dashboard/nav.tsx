import StartupIcon from "@/assets/icons/startup"
import TalentupIcon from "@/assets/icons/talent"
import Link from "next/link"
import { usePathname } from 'next/navigation'

export const items = [
    {
        title: "Start-Ups",
        url: "/admin/dashboard/start-ups",
        icon: StartupIcon,
    },
    {
        title: "Talent",
        url: "/admin/dashboard/talent",
        icon: TalentupIcon,
    },
    {
        title: "Blogs",
        url: "/admin/dashboard/blog",
        icon: TalentupIcon,
    },
    {
        title: "Events",
        url: "/admin/dashboard/events",
        icon: StartupIcon,
    },
]

export default function AdminNavigation() {
    const pathname = usePathname()
    return (
        <nav className="w-max flex flex-col items-start gap-[14px]">
            {items.map((item, index) => {
                const isActiveLink = pathname.startsWith(item.url);
                const Icon = item.icon;
                return (
                    <Link
                        key={index}
                        href={item.url}
                        className={`flex items-center self-stretch gap-[10px] rounded-[9px] py-[9px] px-[16px] transition-colors ${isActiveLink
                            ? 'bg-[#005DFF] text-white-600'
                            : 'hover:bg-gray-100'
                            }`}
                    >

                        <div className='relative'>
                            <Icon color={isActiveLink ? '#ffffff' : '#6B6B6B'} />
                        </div>
                        <span className={`text-center font-bold leading-normal ${isActiveLink ? 'text-[#fff]' : 'text-[#6B6B6B]'}`}>{item.title}</span>
                    </Link>
                )
            })}
        </nav>
    )
}