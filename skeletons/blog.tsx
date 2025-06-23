import { Skeleton } from "@/components/ui/skeleton";

export function BlogSkeleton() {
    return (
        <div className="space-y-4 md:space-y-6">
            {/* Search and Filters Skeleton */}
            <div className="w-full flex flex-col sm:flex-row gap-3 md:gap-[20px] items-stretch sm:items-center py-2 md:py-[6px] px-3 md:px-[12px] bg-white rounded-lg md:rounded-[10px]">
                <Skeleton className="h-10 w-full md:max-w-[700px] bg-gray-100" />
                <div className="flex gap-2 sm:gap-[10px]">
                    <Skeleton className="h-10 w-[160px] bg-gray-100" />
                    <Skeleton className="h-10 w-[160px] bg-gray-100" />
                </div>
            </div>

            {/* Header Skeleton */}
            <div className="bg-white rounded-lg md:rounded-[10px] overflow-hidden">
                <div className="w-full pt-4 md:pt-[16px] flex justify-between items-center px-4 sm:px-5 md:px-[19px]">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-[100px] bg-gray-100" />
                        <Skeleton className="h-4 w-[150px] bg-gray-100" />
                    </div>
                    <Skeleton className="h-8 w-[99px] bg-gray-100" />
                </div>

                {/* Card Grid Skeleton */}
                <div className="px-4 py-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="w-full relative h-[750px] sm:min-h-[850px] space-y-4">
                            {/* Image */}
                            <Skeleton className="w-full h-[200px] rounded-md bg-gray-100" />

                            {/* Title */}
                            <Skeleton className="h-6 w-3/4 bg-gray-100" />

                            {/* Snippet */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full bg-gray-100" />
                                <Skeleton className="h-4 w-5/6 bg-gray-100" />
                                <Skeleton className="h-4 w-4/5 bg-gray-100" />
                            </div>

                            {/* Body Content */}
                            <div className="space-y-2">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <Skeleton key={i} className="h-4 w-full bg-gray-100" />
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="absolute bottom-2 w-full flex justify-between">
                                <Skeleton className="h-10 w-10 rounded-full bg-gray-100" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full bg-gray-100" />
                                    <Skeleton className="h-10 w-10 rounded-full bg-gray-100" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="py-4 px-4 md:px-6">
                    <div className="flex justify-center gap-1">
                        <Skeleton className="h-9 w-9 bg-gray-100" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-9 w-9 bg-gray-100" />
                        ))}
                        <Skeleton className="h-9 w-9 bg-gray-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}