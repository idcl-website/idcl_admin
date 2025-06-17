"use client"
import DashboardLogo from "../general/dashlogo";
import AdminNavigation from "./nav";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
interface AsideViewProps {
    isMobileOpen: boolean;
    onClose: () => void;
}

export default function AsideView({ isMobileOpen, onClose }: AsideViewProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                onClose();
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [onClose]);

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-40"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "bg-[#fff] w-[208px] fixed h-screen py-[26px] px-[15px] flex flex-col items-center gap-[179px]",
                "transition-transform duration-300 ease-in-out",
                "lg:translate-x-0 lg:z-20 lg:left-4 lg:top-4 lg:h-[calc(100vh-32px)] lg:rounded-[10px]", // Desktop positioning
                isMobile ? "z-40" : "z-20",
                isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
            )}>
                <DashboardLogo />
                <AdminNavigation />
            </aside>
        </>
    );
}