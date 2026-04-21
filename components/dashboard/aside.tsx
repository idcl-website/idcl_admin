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
            if (window.innerWidth >= 1024) onClose();
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
                    className="fixed inset-0 bg-black/40 lg:hidden z-40"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "w-[220px] shrink-0 bg-white h-full flex flex-col border-r border-gray-100",
                "transition-transform duration-300 ease-in-out",
                isMobile ? "fixed top-0 left-0 z-50 shadow-xl" : "relative z-10",
                isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"
            )}>
                {/* Logo */}
                <div className="px-5 h-[60px] flex items-center border-b border-gray-100 shrink-0">
                    <DashboardLogo />
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
                    <AdminNavigation />
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 shrink-0">
                    <p className="text-[10px] text-gray-400 text-center tracking-wide uppercase">IDCL Admin v1.0</p>
                </div>
            </aside>
        </>
    );
}