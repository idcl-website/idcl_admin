"use client"
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import StarupSkelenton from "@/skeletons/startup";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";
import ExploreStartUp from "@/components/dashboard/startups";
import { useEffect, useState } from "react";
import { startUpService } from "@/services/startup";
import { toast, Toaster } from "sonner";

export interface StartUpInterface {
    id: string,
    track: string,
    reach: string,
    logo: string,
    date: string,
    name: string,
    story: string,
    type: string,
    isApproved: boolean,
    industry: string,
    region: string,
}

const startUpFilters = [
    {
        title: 'sort',
        options: ['Show All', 'Approved', 'Pending',],
        width: 163,
        selectWidth: 106
    },
    {
        title: 'type',
        options: ['Show All', 'B2B', 'B2C', 'B2B2C', 'B2E', 'B2G', 'C2B', 'C2C', 'D2C', 'G2C', 'G2B'],
        width: 182,
        selectWidth: 106
    },
    {
        title: 'batch',
        options: ['Show All', 2024, 2025, 2026, 2027, 2028],
        width: 127,
        selectWidth: 106
    },
]


const startUps = [
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },
    {
        startUpName: 'MediBridge',
        ecosystem: 'HealthTech',
        description: 'Bridging rural communities to healthcare via mobile clinics.',
        story: 'Case study on how MediBridge has served 50,000+ patients across 12 underserved regions.'
    },



]

export default function Dashboardpage() {
    const router = useRouter()
    const [isFetching, setIsFetching] = useState(true);
    const [startups, setStartups] = useState<StartUpInterface[]>([]);
    const [filteredStartups, setFilteredStartups] = useState<StartUpInterface[]>([]);
    const [filters, setFilters] = useState({
        sort: 'Show All',
        type: 'Show All',
        batch: 'Show All'
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Handle filter changes
    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toLocaleLowerCase());
    };

    useEffect(() => {
        let results = [...startups];

        // Apply search filter
        if (searchQuery) {
            results = results.filter(startup =>
                startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                startup.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
                startup.industry.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply sort filter
        if (filters.sort !== 'Show All') {
            results = results.filter(startup => {
                if (filters.sort === 'Approved') return startup.isApproved;
                if (filters.sort === 'Pending') return !startup.isApproved;
            });
        }

        // Apply type filter
        if (filters.type !== 'Show All') {
            results = results.filter(startup => startup.type === filters.type);
        }

        // Apply batch filter (assuming date contains year)
        if (filters.batch !== 'Show All') {
            results = results.filter(startup => startup.date.toString() === filters.batch);
        }

        setFilteredStartups(results);
    }, [startups, searchQuery, filters]);



    useEffect(() => {
        const getStarUps = async () => {
            try {
                const data = await startUpService.getAllStarups();
                console.log(data)
                setStartups(data)
            } catch (error: any) {
                const resError = error.response?.data?.message || "An Internal Server Error"
                toast.error(resError)
            } finally {
                setIsFetching(false)
            }
        }

        getStarUps();
    }, [])


    if (isFetching) return <StarupSkelenton />
    return (
        <>
            <Toaster richColors position="top-center" />
            <div className="space-y-6">
                <div className="w-full flex items-center gap-[40px]">
                    <div className="w-full md:max-w-[949px] py-[11px] px-[20px] bg-white rounded-[10px]">
                        <aside className="w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-[20px]">
                            <div className="relative w-full md:max-w-[410px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search"
                                    className="pl-10 rounded-[16px] w-full bg-white"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>


                            <div className={`w-full flex items-start gap-[10px]`}>
                                {startUpFilters.map((filter, index) => (
                                    <div key={index} className={`h-[35px] w-full md:w-[${filter.width}px]! rounded-[8px] py-[5px] px-[12px] bg-[#F0F2F5] flex items-center gap-[11px]`}>
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
                    </div >
                    <button
                        onClick={() => {
                            router.push('/admin/dashboard/start-ups/add-new-startup')
                        }}
                        className="bg-[#005EFF] w-full md:w-[123px] py-[11.5px] px-[20px] rounded-[10px] cursor-pointer"
                    >
                        <span className="font-roboto text-white text-[15px] font-medium leading-normal">Add New</span>
                    </button>
                </div>

                <p className="text-[#475467] text-[16px] font-bold leading-[21px]">Star Start-Up To Add To Rising Talent</p>

                {/* EXPLORE STARTUPS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[39px]">
                    {filteredStartups.map((item, index) => (
                        <ExploreStartUp key={index} {...item} setStartups={setStartups} />
                    ))}
                </div>
            </div>
        </>
    )
}