import Image from "next/image";
import logo from '@/assets/images/logo.png'
export default function AppLogo() {
    return (
        <div className="absolute top-[20px] left-[35px] md:left-[85px] w-32 h-16">
            <Image
                src={logo}
                alt="App Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    )
}