"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, Eye, Signature } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from "next/image";
import more from '@/assets/icons/more.svg'
import { useRouter } from "next/navigation";
import TalentPageSkeleton from "@/skeletons/talent";
import { useEffect, useState } from "react";
import { TalentService } from "@/services/talent";
import { toast } from "sonner";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios";


const TalentFilters = [
    {
        title: 'sort',
        options: ['all', 'Approved', 'Pending'],
        width: 163,
        selectWidth: 106
    },
    {
        title: 'batch',
        options: ['all', 2025, 2026, 2027, 2028],
        width: 127,
        selectWidth: 62
    },
]

export interface TalentInterface {
    id: string,
    image: string,
    track: string,
    name: string,
    email: string,
    date: string,
    isApproved: boolean,
    fullYear: number
}

export default function TalentPage() {
    const router = useRouter();
    const [isfetching, setIsFetching] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const [hasMore, setHasMore] = useState(false);
    const [totalTalent, setTotalTalents] = useState(0)
    const [talents, setTalents] = useState<TalentInterface[]>([])
    const [filteredTalents, setFilteredTalents] = useState<TalentInterface[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setfilters] = useState({
        sort: 'all',
        batch: 'all'
    })

    useEffect(() => {
        const getAllTalents = async () => {
            try {
                const data = await TalentService.getAllTalents(currentPage);
                setFilteredTalents(data.talents)
                setTalents(data.talents)
                // setHasMore(data.pagination.hasMore)
                setTotalPages(data.pagination.totalPages)
                setTotalTalents(data.pagination.total)
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    const resError = error.response?.data?.message || "An error occurred. Retry"
                    console.error(resError);
                    toast.error(resError)
                } else {
                    console.error("An unexpected error occurred");
                }
            } finally {
                setIsFetching(false)
            }
        }

        getAllTalents();
    }, [currentPage])

    useEffect(() => {
        let results = [...talents]

        if (searchQuery) {
            results = results.filter((talent) =>
                talent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                talent.track.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (filters.sort !== 'all') {
            results = results.filter((talent) => {
                if (filters.sort === 'Approved') return talent.isApproved
                if (filters.sort === 'Pending') return !talent.isApproved
                return true;
            })
        }

        if (filters.batch !== 'all') {
            results = results.filter((talent) =>
                talent.fullYear.toString() === filters.batch
            )
        }

        setFilteredTalents(results)
    }, [searchQuery, filters, talents])

    const handleFilterChange = (filterType: string, value: string) => {
        setfilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    }


    if (isfetching) {
        return <TalentPageSkeleton />
    }

    return (
        <div className="space-y-4 md:space-y-6 ">
            {/* Search and Filters Section */}
            <aside className="w-full flex flex-col sm:flex-row gap-3 md:gap-[20px] items-stretch sm:items-center py-2 md:py-[6px] px-3 md:px-[12px] bg-white rounded-lg md:rounded-[10px]">
                {/* Search Input */}
                <div className="relative w-full md:max-w-[766px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search"
                        className="pl-10 rounded-2xl md:rounded-[16px] w-full bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-[10px]">
                    {TalentFilters.map((filter, index) => (
                        <div key={index} className="w-full sm:w-auto min-w-[160px] h-[35px] rounded-lg md:rounded-[8px] py-1 md:py-[5px] px-3 md:px-[12px] bg-[#F0F2F5] flex items-center gap-2 md:gap-[11px]">
                            <p className="font-inter font-normal text-xs md:text-[10px] leading-[14px] capitalize text-[#667085] whitespace-nowrap">
                                {filter.title}
                            </p>

                            <Select
                                value={filters[filter.title as keyof typeof filters]}
                                onValueChange={(value) => handleFilterChange(filter.title, value)}
                            >
                                <SelectTrigger className="w-full h-[25px] rounded-sm md:rounded-[4px] bg-[#fff] flex items-center justify-between focus:ring-0 focus:ring-offset-0 data-[state=open]:bg-[#E1ECFF]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent
                                    className="rounded-2xl md:rounded-[16px] border border-[#D0D5DD] bg-[#E1ECFF] w-[var(--radix-select-trigger-width)] min-w-[120px]"
                                    position="popper"
                                    align="end"
                                >
                                    {filter.options.map((option, optionIndex) => (
                                        <SelectItem
                                            key={optionIndex}
                                            value={option.toString()}
                                            className="font-inter font-medium text-xs md:text-[10px] focus:bg-[#D0D5DD]"
                                        >
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Talent Pool Section */}
            <section className="bg-white rounded-lg md:rounded-[10px] overflow-hidden">
                {/* Header */}
                <div className="w-full pt-4 md:pt-[16px] rounded-t-lg md:rounded-t-[10px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 md:pr-[19px] md:pb-[15px] md:pl-[19px] bg-[#fff]">
                    <div>
                        <div className="flex items-center gap-1 md:gap-[6.6px]">
                            <span className="text-[#101828] text-sm md:text-[16px] font-medium leading-5 md:leading-[23px]">Talent Pool</span>
                            <p className="bg-[#F7FAFF] rounded-lg md:rounded-[13px] text-[#005DFF] text-xs md:text-[9px] font-inter font-medium leading-4 md:leading-[14px] py-0.5 md:py-1 px-2">
                                {totalTalent}
                            </p>
                        </div>
                        <p className="text-[#667085] text-xs md:text-[12px] font-normal leading-4 md:leading-[16px]">
                            Certified students from skill-up imo program
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/dashboard/talent/add-talent')}
                        className="rounded-md md:rounded-[6.643px] border border-[0.83px] border-[#005DFF] bg-[#005DFF] shadow-sm md:shadow-[0px_0.83px_1.661px_rgba(16,24,40,0.05)] text-white flex items-center justify-center gap-1 md:gap-[6px] w-full sm:w-auto px-3 md:w-[99px] h-8 md:h-[33px]"
                    >
                        <span className="font-inter text-[#fff] text-xs md:text-[11.626px] font-medium leading-4 md:leading-[16px]">Add</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                            <path
                                d="M8.47897 3.9248V13.6132M3.63477 8.76901H13.3232"
                                stroke="white"
                                strokeWidth="1.38683"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="">
                            <TableRow className="bg-[#FCFCFD] text-[#667085]">
                                <TableHead className="w-[50px] sm:w-[100px]">Serial</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Email</TableHead>
                                <TableHead>Skill</TableHead>
                                <TableHead className="hidden md:table-cell">Date Added</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-[#fff]">
                            {filteredTalents.map((talent, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium font-Inter text-xs md:text-[11px]">{index + 1}</TableCell>
                                    <TableCell>
                                        <Image
                                            src={talent.image}
                                            width={28}
                                            height={28}
                                            alt="talent"
                                            priority
                                            className="object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="text-[#101828] font-medium text-sm md:text-base">
                                        {talent.name}
                                    </TableCell>
                                    <TableCell className="text-[#667085] hidden sm:table-cell">
                                        {talent.email}
                                    </TableCell>
                                    <TableCell className="text-[#667085] text-sm md:text-base">
                                        {talent.track}
                                    </TableCell>
                                    <TableCell className="text-[#667085] hidden md:table-cell">
                                        {talent.date}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Image src={more} alt="more" priority />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    <button onClick={() => {
                                                        router.push(`/admin/dashboard/talent/${talent.id}`)
                                                    }}>
                                                        View
                                                    </button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Signature className="h-4 w-4 mr-2" />
                                                    <button onClick={async () => {
                                                        try {
                                                            await TalentService.toggleTalentStatus(talent.id)
                                                            setFilteredTalents((prev) => prev.map(item => item.id === talent.id ? { ...item, isApproved: !item.isApproved } : item))
                                                            toast.success('talent have approved')
                                                        } catch (error: unknown) {
                                                            if (axios.isAxiosError(error)) {
                                                                const resError = error.response?.data?.message || "An error occurred. Retry"
                                                                console.error(resError);
                                                                toast.error(resError)
                                                            } else {
                                                                console.error("An unexpected error occurred");
                                                            }
                                                        }
                                                    }}>
                                                        {talent.isApproved ? 'Disapprove' : 'Approve'}
                                                    </button>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="py-4 px-4 md:px-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                    }}
                                    aria-disabled={currentPage === 1}
                                    className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                                />
                            </PaginationItem>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page);
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            {totalPages > 5 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                    }}
                                    aria-disabled={currentPage === totalPages}
                                    className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </section>
        </div>
    )
}