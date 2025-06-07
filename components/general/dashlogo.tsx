import Image from "next/image";
import logo from '@/assets/images/dash.png'
export default function DashboardLogo() {
    return (
        <div className="w-[104px] h-[30px]">
            <Image
                src={logo}
                alt="App Logo"
                className="object-contain"
                priority
            />
        </div>
    )
}