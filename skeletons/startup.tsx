import { Skeleton } from "@/components/ui/skeleton";

export default function StartupSkeleton() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[39px]">
            {[...Array(10)].map((_, index) => (
                <Skeleton
                    key={index}
                    className="w-full h-[336px] rounded-xl border-gray-500 shadow-sm"
                />
            ))}
        </div>
    );
}