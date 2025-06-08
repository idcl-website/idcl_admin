"use client"
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";
import ExploreStartUp from "@/components/dashboard/startups";

const startUpFilters = [
    {
        title: 'sort',
        options: ['Show All', 'ascending', 'decending',],
        width: 163,
        selectWidth: 106
    },
    {
        title: 'industry',
        options: ['B2B', 'B2A', 'B2C',],
        width: 182,
        selectWidth: 106
    },
    {
        title: 'batch',
        options: [2025, 2026, 2027, 2028],
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
    return (
        <div className="space-y-6">
            <div className="w-full flex items-center gap-[40px]">
                <div className="w-full md:max-w-[949px] py-[11px] px-[30px] bg-white rounded-[10px]">
                    <aside className="w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-[20px]">
                        <div className="relative w-full md:max-w-[410px]">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search"
                                className="pl-10 rounded-[16px] w-full bg-white"
                            />
                        </div>

                        {/* Filter Section - Responsive Layout */}
                        <div className="flex items-start gap-[10px] w-full self-stretch">
                            {startUpFilters.map((filter, index) => (
                                <div key={index} className={`h-[35px] w-full md:w-[${filter.width}px]! rounded-[8px] py-[5px] px-[12px] bg-[#F0F2F5] flex items-center gap-[11px]`}>
                                    <p className="font-inter font-normal text-xs sm:text-sm md:text-[10px] leading-[14px] capitalize text-[#667085] whitespace-nowrap">
                                        {filter.title}
                                    </p>

                                    <Select>
                                        <SelectTrigger
                                            className={`w-full md:w-[${filter.selectWidth}px] h-[25px]! rounded-[4px] bg-[#fff] flex items-center justify-between focus:ring-0 focus:ring-offset-0 data-[state=open]:bg-[#E1ECFF]`}
                                        >
                                            <SelectValue
                                                placeholder={
                                                    <span className="font-inter font-normal text-xs sm:text-sm md:text-[10px] text-[#667085] leading-[14px] truncate">
                                                        {filter.options[0]}
                                                    </span>
                                                }
                                            />
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
                    className="bg-[#005EFF] w-full md:w-[123px] py-[11.5px] px-[20px] rounded-[10px]"
                >
                    <span className="font-roboto text-white text-[15px] font-medium leading-normal">Add New</span>
                </button>
            </div>

            <p className="text-[#475467] text-[16px] font-bold leading-[21px]">Star Start-Up To Add To Rising Talent</p>

            {/* EXPLORE STARTUPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[39px]">
                {startUps.map((item, index) => (
                    <ExploreStartUp key={index} {...item} id={index + 1} />
                ))}
            </div>
        </div>
    )
}