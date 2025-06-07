import startup from '@/assets/icons/startup.svg'
import talent from '@/assets/icons/talent.svg'
import Link from "next/link"
import Image from "next/image"
import { usePathname } from 'next/navigation'

const items = [
    {
        title: "Start-Ups",
        url: "/admin/dashboard/start-ups",
        src: startup,
    },
    {
        title: "Talent",
        url: "/admin/dashboard/talent",
        src: talent,
    },
]

export default function AdminNavigation() {
    const pathname = usePathname()
    return (
        <nav className="w-full md:w-[177px] flex flex-col items-start gap-[14px]">
            {items.map((item, index) => (
                <Link
                    key={index}
                    href={item.url}
                    className={`flex items-center self-stretch gap-[10px] rounded-[9px] py-[9px] px-[16px] transition-colors ${pathname === item.url
                        ? 'bg-[#005DFF] text-white-600'
                        : 'hover:bg-gray-100'
                        }`}
                >

                    <div className='relative w-5 h-5 text-blue-500'>
                        <Image
                            src={item.src}
                            alt={`${item.title} icon`}
                            fill
                            className='object-contain text-red-500'
                            sizes="20px"
                        />
                    </div>
                    <span className={`text-center font-bold leading-normal ${pathname === item.url ? 'text-[#fff]' : 'text-[#6B6B6B]'}`}>{item.title}</span>
                </Link>
            ))}
        </nav>
    )
}