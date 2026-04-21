import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Rocket, Users, BookOpen, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

export const items = [
    { title: "Start-Ups",  url: "/admin/dashboard/start-ups", icon: Rocket },
    { title: "Talent",     url: "/admin/dashboard/talent",    icon: Users },
    { title: "Blogs",      url: "/admin/dashboard/blog",      icon: BookOpen },
    { title: "Events",     url: "/admin/dashboard/events",    icon: CalendarDays },
]

export default function AdminNavigation() {
    const pathname = usePathname()
    return (
        <nav className="flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
            {items.map((item) => {
                const isActive = pathname.startsWith(item.url);
                const Icon = item.icon;
                return (
                    <Link
                        key={item.url}
                        href={item.url}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            isActive
                                ? "bg-[#005DFF] text-white shadow-sm shadow-blue-200"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                        <span>{item.title}</span>
                    </Link>
                )
            })}
        </nav>
    )
}