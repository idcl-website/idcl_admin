"use client"
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileMenuButton({
    isOpen,
    toggle
}: {
    isOpen: boolean,
    toggle: () => void
}) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="lg:hidden fixed top-4 left-4 z-50" // Increased z-index to 50
        >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
    );
}