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
import { toast, Toaster } from 'sonner'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { founderSchema, startupSchema } from "@/validation/startup"


type FounderInterface = {
    name: string,
    position: string,
    linkedin: string,
    facebook: string,
    twitter: string,
    photo: string
}

const FoundersDto = {
    name: '',
    position: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    photo: ''
}

interface startupDto {
    logo: string,
    name: string,
    location: string,
    date: string,
    track: string,
    reach: number,
    region: number,
    size: number,
    funds: number,
    support: string,
    story: string,
    description: string,
    founders: FounderInterface[]
}

const startupValue = {
    logo: "",
    name: "",
    location: "",
    date: "",
    track: "",
    reach: 0,
    region: 0,
    size: 0,
    funds: 0,
    support: "",
    story: "",
    description: "",
    founders: [] as FounderInterface[]
}


interface FormField {
    label: string;
    name: string;
    placeholder?: string;
    type: 'text' | 'select' | 'photo' | 'textarea' | 'date';
    full?: boolean;
    options?: string[];
}
const startUpData: FormField[] = [
    {
        label: 'logo',
        name: 'logo',
        type: 'photo',
        full: true
    },
    {
        label: 'Name',
        name: 'name',
        placeholder: 'enter start-up name e.g adminting',
        type: 'text',
        full: false
    },
    {
        label: 'Location',
        name: 'location',
        placeholder: 'where is the start-up located',
        type: 'text',
        full: false
    },
    {
        label: 'Date Founded',
        name: 'date',
        type: 'date',
        full: false
    },
    {
        label: 'Program Track',
        name: 'track',
        placeholder: 'program track',
        type: 'text',
        full: false
    },
    {
        label: 'Patients Reached',
        name: 'reach',
        placeholder: 'Patients reached',
        type: 'text',
        full: false
    },
    {
        label: 'Regions Covered',
        name: 'region',
        placeholder: 'Regions Covered',
        type: 'text',
        full: false
    },
    {
        label: 'Team Size',
        name: 'size',
        placeholder: 'what is the team size',
        type: 'text',
        full: false
    },
    {
        label: 'Funding Raised',
        name: 'funds',
        placeholder: 'what is the funds raised',
        type: 'text',
        full: false
    },
    {
        label: 'Support Received',
        name: 'support',
        placeholder: 'funds recieved',
        type: 'textarea',
        full: true
    },
    {
        label: 'Founder Story',
        name: 'story',
        placeholder: 'what is the funders tagline?',
        type: 'textarea',
        full: true
    },
    {
        label: 'Description',
        name: 'description',
        placeholder: 'start up description',
        type: 'textarea',
        full: true
    },
]

interface FondersField {
    label: string,
    name: string,
    placeholder?: string,
    type: 'text' | 'select' | 'photo' | 'textarea' | 'date' | 'select',
    full?: boolean,
    options?: string[]
}

const FoundersData: FondersField[] = [
    {
        label: 'image',
        type: 'photo',
        name: 'photo'
    },
    {
        label: 'Name',
        name: 'name',
        placeholder: 'enter founder name',
        type: 'text',
        full: false
    },
    {
        label: 'Position',
        name: 'position',
        placeholder: 'enter founder position e.g founder, co-founder',
        type: 'text',
        full: false
    },
    {
        label: 'Facebook Profile',
        name: 'facebook',
        placeholder: 'https://www.idcl.com?profile=sfsdfsd804fdfd34504',
        type: 'text',
        full: false
    },
    {
        label: 'Twitter Profile',
        name: 'twitter',
        placeholder: 'https://www.twitter.com?profile=sfsdfsd804fdfd34504',
        type: 'text',
        full: false
    },
    {
        label: 'Linked-In Profile',
        name: 'linkedin',
        placeholder: 'https://www.linkedin.com/in/idcl',
        type: 'text',
        full: false
    },


]

export default function CreateStartUpPage() {
    const router = useRouter();
    const [date, setDate] = useState<Date>()
    const [openDialog, setOpenDialog] = useState(false)
    const [formdata, setFormData] = useState<startupDto>(startupValue);
    const [founder, setFounder] = useState<FounderInterface>(FoundersDto)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [founderErrors, setFounderErrors] = useState<Record<string, string>>({});


    const formik = useFormik({
        initialValues: startupValue,
        validationSchema: startupSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                // Convert date to ISO string if it's a Date object
                const submitValues = {
                    ...values,
                    date: values.date instanceof Date ? values.date.toISOString() : values.date,
                };

                console.log('Submitting:', submitValues);
                // Here you would typically send the data to your backend
                // await submitToBackend(submitValues);

                toast.success('Startup created successfully!');
                router.push('/success-page'); // Redirect on success
            } catch (error) {
                toast.error('Failed to create startup');
                console.error('Submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        },
    });


    const onChangeHandler = (field: keyof startupDto, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'size' || field === 'funds' || field === 'region' || field === 'reach' ? Number(value) : value
        }));
    };

    const onChangeFounderHandler = (field: keyof FounderInterface, value: any) => {
        setFounder((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    console.log(formdata)

    const handleFileUpload = (field: keyof startupDto, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                [field]: reader.result as string
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleFounderFileUpload = (field: keyof FounderInterface, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFounder(prev => ({
                ...prev,
                [field]: reader.result as string
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleDateChange = (date: Date | undefined) => {
        setDate(date);
        if (date) {
            setFormData(prev => ({
                ...prev,
                date: date.toISOString()
            }));
        }
    };

    const getFormValue = (field: keyof startupDto): string => {
        const value = formdata[field];

        if (field === 'size' || field === 'funds') {
            return value.toString(); // Convert numbers to strings
        }
        if (Array.isArray(value)) {
            return ''; // Return empty string for arrays
        }
        return value as string;
    };


    const getFounderFormValue = (field: keyof FounderInterface): string => {
        const value = founder[field];
        if (Array.isArray(value)) {
            return '';
        }
        return value as string;
    };

    return (
        <>
            <Toaster richColors position="top-center" />
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
                <section className="w-full md:w-[834px] p-[32px] rounded-[16px] bg-white border border-stroke border-[#E4E4E4]">
                    <div className="bg-white flex flex-col items-start gap-[24px]">
                        <h1 className="font-figtree text-[21px] font-bold leading-[31px]">Start-Up Details</h1>
                        <form className="w-full ">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                {startUpData.map((item, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "grid items-center gap-1.5 mb-3 sm:mb-3 lg:mb-4",
                                            item.full ? "md:col-span-2" : "md:col-span-1"
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
                                                accept="image/*"
                                                maxSize={500 * 1024}
                                                onDrop={(files) => {
                                                    const file = files[0];
                                                    if (file) handleFileUpload(item.name as keyof startupDto, file);
                                                }}
                                            />
                                        ) : item.type === 'textarea' ? (
                                            <Textarea
                                                id={item.name}
                                                name={item.name}
                                                value={getFormValue(item.name as keyof startupDto)}
                                                onChange={(e) => onChangeHandler(item.name as keyof startupDto, e.target.value)}
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
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={handleDateChange}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            <Input
                                                type={item.type}
                                                id={item.name}
                                                name={formdata.name}
                                                value={getFormValue(item.name as keyof startupDto)}
                                                onChange={(e) => onChangeHandler(item.name as keyof startupDto, e.target.value)}
                                                placeholder={item.placeholder}
                                                className="w-full placeholder:font-figtree text-[14px] sm:text-[15px] lg:text-[16px]"
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="flex flex-col sm:flex-row items-center md:col-span-2 gap-3 md:gap-[16px] w-full justify-end">
                                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                        <DialogTrigger>
                                            <div
                                                className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-transparent border border-[#004acc] rounded-[50px] w-full sm:w-auto group hover:bg-[#004acc]"
                                            >
                                                <p className="font-figtree font-semibold text-base md:text-[18px] text-[#005DFF] group-hover:text-[#fff] leading-[24px]">
                                                    Add founders
                                                </p>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="">
                                            <DialogHeader className="max-h-[90vh] overflow-y-auto scrollbar-hide">
                                                <DialogTitle className="text-[30px] font-bold text-[#344054]">Add Founder</DialogTitle>
                                                <form className="w-full ">
                                                    <div className="w-full grid grid-cols-1 gap-2">
                                                        {FoundersData.map((item, index) => (
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
                                                                        accept="image/*"
                                                                        maxSize={500 * 1024}
                                                                        onDrop={(files) => {
                                                                            const file = files[0];
                                                                            if (file) handleFounderFileUpload(item.name as keyof FounderInterface, file);
                                                                        }}
                                                                    />
                                                                ) : item.type === 'textarea' ? (
                                                                    <Textarea
                                                                        id={item.name}
                                                                        name={item.name}
                                                                        value={getFounderFormValue(item.name as keyof FounderInterface)}
                                                                        onChange={(e) => onChangeFounderHandler(item.name as keyof FounderInterface, e.target.value)}
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
                                                                        value={getFounderFormValue(item.name as keyof FounderInterface)}
                                                                        onChange={(e) => onChangeFounderHandler(item.name as keyof FounderInterface, e.target.value)}
                                                                        placeholder={item.placeholder}
                                                                        className="w-full placeholder:font-figtree text-[14px] sm:text-[10px] lg:text-[13px] font-normal"
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}

                                                    </div>

                                                    <div className="flex flex-col sm:flex-row items-center md:col-span-2 gap-3 md:gap-[16px] w-full justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    founders: !prev.founders.length ? [founder] : [...prev.founders, founder]
                                                                }))
                                                                toast.success('Founder Added')
                                                                setFounder(FoundersDto);
                                                            }}
                                                            className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-transparent border border-[#004acc] rounded-[50px] w-full sm:w-auto group hover:bg-[#004acc]"
                                                        >
                                                            <p className="font-figtree font-semibold text-base md:text-[18px] text-[#005DFF] group-hover:text-[#fff] leading-[24px]">
                                                                {formdata.founders.length > 0 ? 'Add More' : 'Add'}
                                                            </p>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenDialog(false)
                                                            }}
                                                            className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-[#005DFF] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-[50px] w-full sm:w-auto hover:bg-[#004acc] transition-colors"
                                                        >
                                                            <p className="font-figtree font-semibold text-base md:text-[18px] text-[#fff] leading-[24px]">
                                                                Done
                                                            </p>
                                                        </button>
                                                    </div>
                                                </form>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                    <button
                                        type="submit"
                                        disabled={formdata.founders.length < 1 || isSubmitting}
                                        className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-[#005DFF] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-[50px] w-full sm:w-auto hover:bg-[#004acc] transition-colors"
                                    >
                                        <p className="font-figtree font-semibold text-base md:text-[18px] text-[#fff] leading-[24px]">
                                            submit
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                </section>
            </main>
        </>
    )
}