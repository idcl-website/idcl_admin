import { Skeleton } from "@/components/ui/skeleton";

export default function StartupSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[39px]">
            {[...Array(6)].map((_, index) => (
                <div
                    key={index}
                    className="relative border border-solid border-[#E4E4E4] rounded-lg lg:rounded-[12px] bg-white w-full lg:w-[342px] pt-8 sm:pt-10 lg:pt-[27px] px-4 sm:px-5 lg:px-[20px] pb-5 sm:pb-6 lg:pb-[14px] flex flex-col items-start gap-4 sm:gap-5 lg:gap-[18px]"
                >
                    {/* Favorite button skeleton */}
                    <Skeleton className="absolute right-4 sm:right-5 lg:right-[20px] top-4 sm:top-5 lg:top-[20px] w-[27px] h-[26px] bg-[#F9F9F9] rounded-full" />

                    {/* Logo and name row */}
                    <div className="flex items-center gap-3 lg:gap-[11px] w-full">
                        <Skeleton className="w-[64px] h-[64px] bg-[#F9F9F9] rounded-full" />
                        <Skeleton className="h-5 w-1/2 rounded-md bg-[#F9F9F9]" />
                    </div>

                    {/* Ecosystem tag */}
                    <Skeleton className="w-[74px] h-7 rounded-md lg:rounded-[8px] bg-[#F9F9F9]" />

                    {/* Description */}
                    <div className="w-full space-y-2">
                        <Skeleton className="h-4 w-full rounded-md bg-[#F9F9F9]" />
                        <Skeleton className="h-4 w-4/5 rounded-md bg-[#F9F9F9]" />
                        <Skeleton className="h-4 w-3/4 rounded-md bg-[#F9F9F9]" />
                    </div>

                    {/* Story section */}
                    <div className="w-full p-3 bg-[#F9F9F9] rounded-md space-y-2">
                        <Skeleton className="h-3 w-full rounded-md" />
                        <Skeleton className="h-3 w-5/6 rounded-md" />
                    </div>

                    {/* View Profile button */}
                    <Skeleton className="w-full lg:w-[159px] h-10 rounded-full bg-[#F9F9F9]" />
                </div>
            ))}
        </div>
    );
}