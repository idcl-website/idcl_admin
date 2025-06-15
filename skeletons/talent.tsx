"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

export default function TalentPageSkeleton() {

    return (
        <div className="space-y-6">
            {/* Search and Filters Skeleton */}
            <aside className="w-full flex gap-2 md:gap-[20px] items-center flex-col md:flex-row py-[6px] px-[12px] bg-white rounded-[10px]">
                <div className="relative w-full md:max-w-[766px]">
                    <Skeleton className="h-10 w-full rounded-[16px]" />
                </div>

                <div className="flex items-start gap-[10px] w-full md:w-auto">
                    {[1, 2].map((filter) => (
                        <div key={filter} className="w-full md:min-w-[160px] h-[35px] rounded-[8px] flex items-center gap-[11px]">
                            <Skeleton className="h-[35px] w-full rounded-[8px]" />
                        </div>
                    ))}
                </div>
            </aside>

            {/* Header Skeleton */}
            <section>
                <div className="w-full pt-[16px] rounded-t-[10px] flex items-center justify-between pr-[19px] pb-[15px] pl-[19px] bg-[#fff]">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-[150px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <Skeleton className="h-[33px] w-[99px] rounded-[6.643px]" />
                </div>

                {/* Table Skeleton */}
                <div>
                    <Table>
                        <TableHeader className="bg-[#FCFCFD]">
                            <TableRow>
                                {['Serial', 'Image', 'Name', 'Email', 'Skill', 'Date', ''].map((header) => (
                                    <TableHead key={header}>
                                        <Skeleton className="h-4 w-[80px]" />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-[#fff]">
                            {[...Array(10)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-[20px]" /></TableCell>
                                    <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-4 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </div>
    )
}