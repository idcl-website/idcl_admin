"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/ui/file-uploader";
import { Uploader } from "@/components/ui/uploader";
import { useState } from 'react'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import back from "@/assets/icons/back.svg"
import { useRouter } from "next/navigation";
import * as yup from 'yup';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { startupSchema, founderSchema } from "@/validation/startup";
import { LoaderCircle } from 'lucide-react'
import { startUpService } from "@/services/startup";
import { uploadToCloudinary } from "@/HelperFunctions/uploadToCloudinary";
import axios from "axios";


export type FounderInterface = {
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

export interface startupDto {
    logo: string,
    name: string,
    industry: string,
    location: string,
    date: string,
    track: string,
    reach: string,
    type: string,
    region: string,
    size: string,
    funds: string,
    support: string,
    story: string,
    description: string,
    founders: FounderInterface[]
}

const startupValue = {
    logo: "",
    name: "",
    location: "",
    industry: '',
    date: "",
    track: "",
    reach: '',
    type: '',
    region: '',
    size: '',
    funds: '',
    support: "",
    story: "",
    description: "",
    founders: [] as FounderInterface[]
}

interface FormField {
    label: string;
    name: string;
    placeholder?: string;
    type: 'text' | 'select' | 'image' | 'textarea' | 'date';
    full?: boolean;
    options?: string[];
}

const startUpData: FormField[] = [
    {
        label: 'logo',
        name: 'logo',
        type: 'image',
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
        label: 'Business Type',
        name: 'type',
        options: ['B2B', 'B2C', 'B2B2C', 'B2E', 'B2G', 'C2B', 'C2C', 'D2C', 'G2C', 'G2B'],
        type: 'select',
        full: false
    },
    {
        label: 'Industry',
        name: 'industry',
        placeholder: 'specify industry',
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
    const [isUploadingStartupImage, setIsUploadingStartupImage] = useState<boolean>(false)
    const [isUploadingFounderImage, setIsUploadingFounderImage] = useState<boolean>(false)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [founderErrors, setFounderErrors] = useState<Record<string, string>>({});

    const onChangeHandler = (field: keyof startupDto, value: any) => {
        const processedValue = (field === 'type' && value === "") ? undefined : value;
        setFormData(prev => ({
            ...prev,
            [field]: processedValue
        }));

        validateField(field, processedValue);
    };

    const onChangeFounderHandler = (field: keyof FounderInterface, value: any) => {
        setFounder((prev) => ({
            ...prev,
            [field]: value
        }))
        validateFounderField(field, value);
    }


    // Validate individual field
    const validateField = async (fieldName: keyof startupDto, value: any) => {
        try {
            // Create a partial object with just the field we want to validate
            const partialData = { [fieldName]: value };
            await startupSchema.validateAt(fieldName, partialData);

            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        } catch (error: unknown) {
            let errorMessage = 'Validation failed';

            if (error instanceof yup.ValidationError) {
                errorMessage = error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setFounderErrors(prev => ({
                ...prev,
                [fieldName]: errorMessage
            }));
        }
    };

    // Validate founder field
    const validateFounderField = async (fieldName: keyof FounderInterface, value: any) => {
        try {
            // Create a partial object with just the field we want to validate
            const partialData = { [fieldName]: value };
            await founderSchema.validateAt(fieldName, partialData);

            setFounderErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        } catch (error: unknown) {
            let errorMessage = 'Validation failed';

            if (error instanceof yup.ValidationError) {
                errorMessage = error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setFounderErrors(prev => ({
                ...prev,
                [fieldName]: errorMessage
            }));
        }
    };

    // Validate entire form
    const validateForm = async (data: startupDto): Promise<boolean> => {
        try {
            await startupSchema.validate(data, { abortEarly: false });
            setFormErrors({});
            return true;
        } catch (error: unknown) {
            if (error instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                error.inner.forEach((err) => {
                    if (err.path) {
                        errors[err.path] = err.message;
                    }
                });
                setFormErrors(errors);
            }
            return false;
        }
    };

    // Validate founder
    const validateFounderForm = async (founderData: FounderInterface): Promise<boolean> => {
        try {
            await founderSchema.validate(founderData, { abortEarly: false });
            setFounderErrors({});
            return true;
        } catch (error: unknown) {
            if (error instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                error.inner.forEach((err) => {
                    if (err.path) {
                        errors[err.path] = err.message;
                    }
                });
                setFounderErrors(errors);
            }
            return false;
        }
    };

    const handleDateChange = (date: Date | undefined) => {
        setDate(date);
        if (date) {
            const dateString = date.toISOString();
            setFormData(prev => ({
                ...prev,
                date: dateString
            }));
            validateField('date', dateString);
        }
    };

    console.log("this is the form infos", formdata)

    const getFormValue = (field: keyof startupDto): string => {
        const value = formdata[field];
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

    const handleAddFounder = async () => {

        if (!founder.photo) {
            toast.error('Please upload a founder photo');
            return;
        }

        const isValid = await validateFounderForm(founder);
        if (isValid) {
            setFormData((prev) => ({
                ...prev,
                founders: [...prev.founders, founder]
            }));
            toast.success('Founder Added');
            setFounder(FoundersDto);
            setFounderErrors({});
        } else {
            toast.error('Please fix the errors before adding founder');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const isValid = await validateForm(formdata);

        if (isValid) {
            try {
                await startUpService.postStartUp(formdata)
                toast.success('Startup created successfully!');
                setFormData(startupValue)
                setFounder(FoundersDto)
                router.push('/admin/dashboard/start-ups');
            } catch (error: unknown) {
                const resError = 'Network Error'
                toast.error(resError);
                console.log(error)
            } finally {
                setIsSubmitting(false);
            }
        } else {
            toast.error('Please fix all errors before submitting');
        }
        setIsSubmitting(false);
    };

    return (
        <>
            <Toaster richColors position="top-center" />
            <main className="w-full px-4 sm:px-6 lg:px-0 flex flex-col md:flex-row gap-4 lg:gap-[25px] items-start justify-center mb-6">
                <button onClick={() => router.back()} className="mt-4 sm:mt-0">
                    <Image
                        src={back}
                        alt="Back-Button"
                        width={40}
                        height={40}
                        className="object-cover"
                    />
                </button>
                <section className="w-full max-w-4xl md:w-[834px] p-4 sm:p-6 lg:p-[32px] rounded-[16px] bg-white border border-stroke border-[#E4E4E4]">
                    <div className="bg-white flex flex-col items-start gap-4 sm:gap-6 lg:gap-[24px]">
                        <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-4">
                            <h1 className="font-figtree text-lg sm:text-xl lg:text-[21px] font-bold leading-[31px]">
                                Start-Up Details
                            </h1>
                            <div className="min-h-[80px] min-w-[80px] max-w-[120px] max-h-[120px] relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                                {isUploadingStartupImage && (
                                    <div className="flex flex-col items-center">
                                        <LoaderCircle className="animate-spin text-blue-400 w-6 h-6" />
                                        <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                                    </div>
                                )}

                                {!isUploadingStartupImage && formdata.logo === "" && (
                                    <p className="text-sm text-gray-500">No logo uploaded yet</p>
                                )}

                                {!isUploadingStartupImage && formdata.logo !== "" && (
                                    <img
                                        src={formdata.logo}
                                        alt="start-up logo"
                                        className="object-contain rounded-lg"
                                        width={100}
                                        height={100}
                                    />
                                )}
                            </div>
                        </div>
                        <form className="w-full" onSubmit={handleSubmit}>
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                {startUpData.map((item, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "grid items-center gap-1.5 mb-3 sm:mb-3 lg:mb-4 relative",
                                            item.full ? "md:col-span-2" : "md:col-span-1"
                                        )}
                                    >
                                        <Label htmlFor={item.name} className="text-sm sm:text-base">
                                            {item.label}
                                        </Label>

                                        {item.type === 'select' ? (
                                            <>
                                                <Select
                                                    onValueChange={(value) => {
                                                        onChangeHandler(item.name as keyof startupDto, value === "" ? undefined : value);
                                                    }}
                                                    value={formdata.type || ""}
                                                >
                                                    <SelectTrigger className="w-full text-sm sm:text-[15px] lg:text-[16px] border border-[#D0D5DD]">
                                                        <SelectValue placeholder="Select business type" />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        className="rounded-[16px] border border-[#D0D5DD] bg-[#e6efff] w-[var(--radix-select-trigger-width)] min-w-[120px]"
                                                        position="popper"
                                                        align="end"
                                                    >

                                                        {item.options?.map((option, i) => (
                                                            <SelectItem
                                                                key={i}
                                                                value={option.toLowerCase().replace(' ', '-')}
                                                                className="font-inter font-medium text-xs sm:text-sm md:text-[10px] focus:bg-[#D0D5DD]"
                                                            >
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {item.type === 'select' && formErrors[item.name] && (
                                                    <p className="text-red-500 text-sm mt-1">{formErrors[item.name]}</p>
                                                )}
                                            </>
                                        ) : item.type === 'image' ? (
                                            <>
                                                <FileUploader
                                                    accept="image/*"
                                                    maxSize={500 * 1024}
                                                    onDrop={async (files) => {
                                                        const file = files[0];
                                                        if (file) {
                                                            try {
                                                                setIsUploadingStartupImage(true)
                                                                const startupUrl = await uploadToCloudinary(file);
                                                                if (startupUrl) setFormData((prev) => ({ ...prev, logo: startupUrl }))
                                                                toast.success('Photo uploaded successfully')
                                                            } catch (error: unknown) {
                                                                if (axios.isAxiosError(error)) {
                                                                    const resError = error.response?.data?.message || "An error occurred. Retry"
                                                                    console.error(resError);
                                                                    toast.error(resError)
                                                                } else {
                                                                    console.error("An unexpected error occurred");
                                                                }
                                                            } finally {
                                                                setIsUploadingStartupImage(false)
                                                            }

                                                        }
                                                    }}
                                                />
                                                {formErrors[item.name] && (
                                                    <p className="text-red-500 text-sm mt-1">{formErrors[item.name]}</p>
                                                )}
                                            </>
                                        ) : item.type === 'textarea' ? (
                                            <>
                                                <Textarea
                                                    id={item.name}
                                                    name={item.name}
                                                    value={getFormValue(item.name as keyof startupDto)}
                                                    onChange={(e) => onChangeHandler(item.name as keyof startupDto, e.target.value)}
                                                    placeholder={item.placeholder}
                                                    className={cn(
                                                        "w-full min-h-[100px] sm:min-h-[110px] lg:min-h-[120px] text-sm sm:text-[15px] lg:text-[16px]",
                                                        formErrors[item.name] && "border-red-500"
                                                    )}
                                                />
                                                {formErrors[item.name] && (
                                                    <p className="text-red-500 text-sm mt-1">{formErrors[item.name]}</p>
                                                )}
                                            </>
                                        ) : item.type === 'date' ? (
                                            <>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            data-empty={!date}
                                                            className={cn(
                                                                "data-[empty=true]:text-muted-foreground w-full bg-white border-[#E1E5EB] h-[40px] sm:h-[46px] justify-start text-left font-normal",
                                                                formErrors[item.name] && "border-red-500"
                                                            )}
                                                        >
                                                            <CalendarIcon className="h-4 w-4" />
                                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 sm:ml-8" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={date}
                                                            onSelect={handleDateChange}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {formErrors[item.name] && (
                                                    <p className="text-red-500 text-sm mt-1">{formErrors[item.name]}</p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Input
                                                    type={item.type}
                                                    id={item.name}
                                                    name={item.name}
                                                    value={getFormValue(item.name as keyof startupDto)}
                                                    onChange={(e) => onChangeHandler(item.name as keyof startupDto, e.target.value)}
                                                    placeholder={item.placeholder}
                                                    className={cn(
                                                        "w-full placeholder:font-figtree text-sm sm:text-[15px] lg:text-[16px]",
                                                        formErrors[item.name] && "border-red-500"
                                                    )}
                                                />
                                                <div className="absolute top-0 right-0">
                                                    {formErrors[item.name] && (
                                                        <p className="text-red-500 text-sm mt-1">{formErrors[item.name]}</p>
                                                    )}
                                                </div>

                                            </>
                                        )}
                                    </div>
                                ))}

                                {/* Founders Error */}
                                {formErrors.founders && (
                                    <div className="md:col-span-2">
                                        <p className="text-red-500 text-sm">{formErrors.founders}</p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row items-center md:col-span-2 gap-3 md:gap-[16px] w-full justify-end">
                                    <button
                                        type="button"
                                        className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-transparent border border-[#004acc] rounded-[50px] w-full sm:w-auto group hover:bg-[#004acc]"
                                        onClick={() => setOpenDialog(true)}
                                    >
                                        <p className="font-figtree font-semibold text-sm sm:text-base md:text-[18px] text-[#005DFF] group-hover:text-[#fff] leading-[24px]">
                                            Add founders ({formdata.founders.length})
                                        </p>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formdata.founders.length < 1 || isSubmitting}
                                        className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-[#005DFF] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-[50px] w-full sm:w-auto hover:bg-[#004acc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <p className="font-figtree font-semibold text-sm sm:text-base md:text-[18px] text-[#fff] leading-[24px] flex items-center gap-2">
                                            {isSubmitting ? (
                                                <>
                                                    <LoaderCircle className="animate-spin h-4 w-4" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit'
                                            )}
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl">
                    <DialogHeader className="max-h-[80vh] overflow-y-auto scrollbar-hide">
                        <DialogTitle className="text-lg sm:text-xl lg:text-[20px] font-bold text-[#344054]">
                            <p>Add Founder</p>
                            <div className="min-h-[80px] min-w-[80px] max-w-[120px] max-h-[120px] mt-4 relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                                {isUploadingFounderImage ? (
                                    <div className="flex flex-col items-center">
                                        <LoaderCircle className="animate-spin text-blue-400 w-6 h-6" />
                                        <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                                    </div>
                                ) : founder.photo ? (
                                    <img
                                        src={founder.photo}
                                        alt="founder photo"
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-500">No photo uploaded yet</p>
                                )}
                            </div>
                        </DialogTitle>
                        <div className="w-full grid grid-cols-1 gap-2">
                            {FoundersData.map((item, index) => (
                                <div key={index} className="gap-1.5 mb-3 sm:mb-3 lg:mb-4">
                                    <Label htmlFor={item.name} className="text-sm sm:text-base">
                                        {item.label}
                                    </Label>

                                    {item.type === 'photo' ? (
                                        <>
                                            <Uploader
                                                accept="image/*"
                                                maxSize={5 * 1024 * 1024}
                                                onDrop={async (files) => {
                                                    const file = files[0];
                                                    if (file) {
                                                        setIsUploadingFounderImage(true)
                                                        try {
                                                            const founderUrl = await uploadToCloudinary(file);
                                                            if (founderUrl) setFounder((prev) => ({
                                                                ...prev,
                                                                photo: founderUrl
                                                            }))
                                                            toast.success('Photo uploaded successfully')
                                                        } catch (error: unknown) {
                                                            if (axios.isAxiosError(error)) {
                                                                const resError = error.response?.data?.message || "An error occurred. Retry"
                                                                console.error(resError);
                                                                toast.error(resError)
                                                            } else {
                                                                console.error("An unexpected error occurred");
                                                            }
                                                        } finally {
                                                            setIsUploadingFounderImage(false)
                                                        }

                                                    }
                                                }}
                                            />
                                            {founderErrors[item.name] && (
                                                <p className="text-red-500 text-sm mt-1">{founderErrors[item.name]}</p>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Input
                                                type={item.type}
                                                id={item.name}
                                                name={item.name}
                                                value={getFounderFormValue(item.name as keyof FounderInterface)}
                                                onChange={(e) => onChangeFounderHandler(item.name as keyof FounderInterface, e.target.value)}
                                                placeholder={item.placeholder}
                                                className={cn(
                                                    "w-full placeholder:font-figtree text-sm sm:text-[14px] lg:text-[13px] font-normal",
                                                    founderErrors[item.name] && "border-red-500"
                                                )}
                                            />
                                            {founderErrors[item.name] && (
                                                <p className="text-red-500 text-sm mt-1">{founderErrors[item.name]}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center md:col-span-2 gap-3 md:gap-[16px] w-full justify-end">
                            <button
                                type="button"
                                onClick={handleAddFounder}
                                className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-transparent border border-[#004acc] rounded-[50px] w-full sm:w-auto group hover:bg-[#004acc]"
                            >
                                <p className="font-figtree font-semibold text-sm sm:text-base md:text-[18px] text-[#005DFF] group-hover:text-[#fff] leading-[24px]">
                                    {formdata.founders.length > 0 ? 'Add More' : 'Add'}
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenDialog(false)
                                    setFounder(FoundersDto)
                                }}
                                className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-[#005DFF] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-[50px] w-full sm:w-auto hover:bg-[#004acc] transition-colors"
                            >
                                <p className="font-figtree font-semibold text-sm sm:text-base md:text-[18px] text-[#fff] leading-[24px]">
                                    {formdata.founders.length > 0 ? 'Done' : 'Cancel'}
                                </p>
                            </button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}