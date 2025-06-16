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
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import talent from '@/assets/images/talent.png'
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";

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
    const [hasMore, setHasMore] = useState(false);
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
                console.log(data.talents)
                setFilteredTalents(data.talents)
                setTalents(data.talents)
                setHasMore(data.pagination.hasMore)
                setTotalPages(data.pagination.totalPages)
                setTotalTalents(data.pagination.total)
            } catch (error: any) {
                const resError = error.response?.data?.message || "Check your internet connection. Try again"
                toast.error(resError)
            } finally {
                setIsFetching(false)
            }
        }

        getAllTalents();
    }, [currentPage])


    useEffect(() => {

        let results = [...talents]

        if (searchQuery) {
            results = results.filter((talent) => talent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                talent.track.toLowerCase().includes(searchQuery.toLowerCase()))
        }

        if (filters.sort !== 'all') {
            results = results.filter((talent) => {
                if (filters.sort === 'Approved') return talent.isApproved
                if (filters.sort === 'Pending') return !talent.isApproved
                return true;
            })
        }

        if (filters.batch !== 'all') {
            results = results.filter((talent) => {
                // console.log(talent.date)
                // console.log(filters.batch)
                return (talent.fullYear.toString() === filters.batch);
            })
        }

        setFilteredTalents(results)

    }, [searchQuery, filters])

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
        <div className="space-y-6">
            <aside className="w-full flex gap-2 md:gap-[20px] items-center flex-col md:flex-row py-[6px] px-[12px] bg-white rounded-[10px]">
                <div className="relative w-full md:max-w-[766px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search"
                        className="pl-10 rounded-[16px] w-full bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>


                <div className="flex items-start gap-[10px]">
                    {TalentFilters.map((filter, index) => (
                        <div key={index} className={`w-full md:min-w-[${filter.width}px] h-[35px] rounded-[8px] py-[5px] px-[12px] bg-[#F0F2F5] flex items-center gap-[11px]`}>
                            <p className="font-inter font-normal text-xs sm:text-sm md:text-[10px] leading-[14px] capitalize text-[#667085] whitespace-nowrap">
                                {filter.title}
                            </p>

                            <Select
                                value={filters[filter.title as keyof typeof filters]}
                                onValueChange={(value) => handleFilterChange(filter.title, value)}
                            >
                                <SelectTrigger
                                    className={`w-full md:w-[${filter.selectWidth}px] h-[25px]! rounded-[4px] bg-[#fff] flex items-center justify-between focus:ring-0 focus:ring-offset-0 data-[state=open]:bg-[#E1ECFF]`}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent
                                    className="rounded-[16px] border border-[#D0D5DD] bg-[#E1ECFF] w-[var(--radix-select-trigger-width)] min-w-[120px]"
                                    position="popper"
                                    align="end"
                                >
                                    {filter.options.map((option, optionIndex) => (
                                        <SelectItem
                                            key={optionIndex}
                                            value={option.toString()}
                                            className="font-inter font-medium text-xs sm:text-sm md:text-[10px] focus:bg-[#D0D5DD]"
                                        >
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
            </aside >

            <section>
                <div className="w-full pt-[16px] rounded-t-[10px] flex items-center justify-between pr-[19px] pb-[15px] pl-[19px] bg-[#fff]">
                    <div>
                        <div className="flex items-center gap-[6.6px]">
                            <span className="text-[#101828] text-[16px] font-medium leading-[23px]">Talent Pool</span>
                            <p className="bg-[#F7FAFF] rounded-[13px] text-[#005DFF] text-[9px] font-inter font-medium leading-[14px] py-1 px-2">{totalTalent}</p>
                        </div>
                        <p className="text-[#667085] text-[12px] font-normal leading-[16px]">Certified students from skill-up imo program</p>
                    </div>
                    <button
                        onClick={() => {
                            router.push('/admin/dashboard/talent/add-talent')
                        }}
                        className="
                        rounded-[6.643px] 
                        border border-[0.83px] border-[#005DFF] 
                        bg-[#005DFF] 
                        shadow-[0px_0.83px_1.661px_rgba(16,24,40,0.05)]
                        text-white 
                        flex items-center justify-center gap-[6px] w-[99px] h-[33px]
                    "
                    >
                        <span className="font-inter text-[#fff] text-[11.626px] font-medium leading-[16px]">Add</span>

                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                            <path
                                d="M8.47897 3.9248V13.6132M3.63477 8.76901H13.3232"
                                stroke="white"
                                strokeWidth="1.38683"  // Changed from stroke-width
                                strokeLinecap="round"   // Changed from stroke-linecap
                                strokeLinejoin="round"  // Changed from stroke-linejoin
                            />
                        </svg>
                    </button>
                </div>
                <div>
                    <Table className="">
                        <TableHeader className="">
                            <TableRow className="w-full bg-[#FCFCFD] text-[#667085]">
                                <TableHead className="w-[100px]">Serial Number</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Skill</TableHead>
                                <TableHead>Date Added</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-[#fff]">
                            {filteredTalents.map((talent, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium font-Inter text-[11px]">{index + 1}</TableCell>
                                    <TableCell><Image src={talent.image} width={28} height={28} alt="talent" priority className="object-cover" /></TableCell>
                                    <TableCell className="text-[#101828] font-medium">{talent.name}</TableCell>
                                    <TableCell className="text-[#667085]">{talent.email}</TableCell>
                                    <TableCell className="text-[#667085]">{talent.track}</TableCell>
                                    <TableCell className="text-[#667085]">{talent.date}</TableCell>
                                    <TableCell className="">
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
                                                    <button onClick={() => { }}>
                                                        Approve
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
                <div>
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
