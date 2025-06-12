"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/ui/file-uploader";
import { useState } from 'react'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import back from "@/assets/icons/back.svg"
import { useRouter } from "next/navigation";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface FoundersField {
    label: string,
    name: string,
    placeholder?: string,
    type: 'text' | 'select' | 'photo' | 'textarea' | 'date' | 'select',
    full?: boolean,
    options?: string[]
}

const TalentData: FoundersField[] = [
    {
        label: 'image',
        type: 'photo',
        name: 'photo'
    },
    {
        label: 'Name',
        name: 'name',
        placeholder: 'enter talent name',
        type: 'text',
        full: false
    },
    {
        label: 'Email',
        name: 'email',
        placeholder: 'idcl@gmail.com',
        type: 'text',
        full: false
    },
    {
        label: 'Track',
        name: 'track',
        placeholder: 'software engineer, video grapher, designer',
        type: 'text',
        full: false
    },

]
export default function AddTalent() {
    const router = useRouter();
    const [date, setDate] = useState<Date>()
    return (
        <main className="w-full flex flex-col md:flex-row gap-4 lg:gap-[25px] items-start justify-center mb-6">
            <button onClick={() => router.back()} >
                <Image
                    src={back}
                    alt="Back-Button"
                    width={40}
                    height={40}
                    className="object-cover"
                />
            </button>
            <div className="bg-[#fff] w-full md:w-[640px] rounded-[16px] shadow-lg p-[32px]">
                <form className="w-full ">
                    <div className="w-full grid grid-cols-1 gap-2">
                        {TalentData.map((item, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "gap-1.5 mb-3 sm:mb-3 lg:mb-4",
                                )}
                            >
                                <Label htmlFor={item.name} className="">
                                    {item.label}
                                </Label>

                                {item.type === 'select' ? (
                                    <Select>
                                        <SelectTrigger className="w-full text-[14px] sm:text-[15px] lg:text-[16px]">
                                            <SelectValue placeholder={item.placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {item.options?.map((option, i) => (
                                                <SelectItem key={i} value={option.toLowerCase().replace(' ', '-')}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : item.type === 'photo' ? (
                                    <FileUploader
                                        accept=".png,.jpg,.jpeg,"
                                        maxSize={500 * 1024}
                                        onDrop={(files) => {
                                            const file = files[0];
                                            if (file) {
                                                // const img = new Image();
                                                // img.onload = () => {
                                                //     if (img.width !== img.height) {
                                                //         alert("Logo must be square (1:1 aspect ratio)");
                                                //         return;
                                                //     }
                                                // };
                                                // img.src = URL.createObjectURL(file);
                                                console.log(file)
                                            }
                                        }}
                                    />
                                ) : item.type === 'textarea' ? (
                                    <Textarea
                                        id={item.name}
                                        name={item.name}
                                        placeholder={item.placeholder}
                                        className="w-full min-h-[120px] sm:min-h-[110px] lg:min-h-[120px] text-[14px] sm:text-[15px] lg:text-[16px]"
                                    />
                                ) : item.type === 'date' ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                data-empty={!date}
                                                className="data-[empty=true]:text-muted-foreground w-full bg-white border-[#E1E5EB] h-[46px] justify-start text-left font-normal"
                                            >
                                                <CalendarIcon />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 ml-8 " align="start">
                                            <Calendar mode="single" selected={date} onSelect={setDate} />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <Input
                                        type={item.type}
                                        id={item.name}
                                        name={item.name}
                                        placeholder={item.placeholder}
                                        className="w-full placeholder:font-figtree text-[14px] sm:text-[10px] lg:text-[13px] font-normal"
                                    />
                                )}
                            </div>
                        ))}

                    </div>

                    <div className="flex flex-col sm:flex-row items-center md:col-span-2 gap-3 md:gap-[16px] w-full justify-end">
                        <button
                            className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-transparent border border-[#004acc] rounded-[50px] w-full sm:w-auto group hover:bg-[#004acc]"
                        >
                            <p className="font-figtree font-semibold text-base md:text-[18px] text-[#005DFF] group-hover:text-[#fff] leading-[24px]">
                                Cancel
                            </p>
                        </button>
                        <button
                            type="submit"
                            className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-[#005DFF] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-[50px] w-full sm:w-auto hover:bg-[#004acc] transition-colors"
                        >
                            <p className="font-figtree font-semibold text-base md:text-[18px] text-[#fff] leading-[24px]">
                                Submit
                            </p>
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}