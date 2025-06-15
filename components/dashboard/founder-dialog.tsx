import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Uploader } from "@/components/ui/uploader";
import { toast, Toaster } from 'sonner'
import { founderSchema } from "@/validation/startup";
import { cn } from "@/lib/utils"
import * as yup from 'yup';

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

interface FounderDialog {
    openDialog: boolean,
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function FoundedDialog({ openDialog, setOpenDialog }: FounderDialog) {
    const [founder, setFounder] = useState<FounderInterface>(FoundersDto)
    const [isUploadingFounder, setIsUploadingFounder] = useState(false)
    const [founderErrors, setFounderErrors] = useState<Record<string, string>>({});

    console.log(founder)

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
        } catch (error: any) {
            if (error instanceof yup.ValidationError) {
                setFounderErrors(prev => ({
                    ...prev,
                    [fieldName]: error.message
                }));
            }
        }
    };

    const onChangeFounderHandler = (field: keyof FounderInterface, value: any) => {
        setFounder((prev) => ({
            ...prev,
            [field]: value
        }))
        validateFounderField(field, value);
    }

    const getFounderFormValue = (field: keyof FounderInterface): string => {
        const value = founder[field];
        if (Array.isArray(value)) {
            return '';
        }
        return value as string;
    };


    const uploadFounderImage = async (file: File): Promise<string | null> => {
        console.log('updating fonder image')
        setIsUploadingFounder(true);
        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset!);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                console.log("founder image", data.secure_url)
                setFounder((prev) => ({
                    ...prev,
                    photo: data.secure_url
                }))
                toast.success('Image added successfully');
                return data.secure_url;
            } else {
                toast.error('Image upload failed');
                return null;
            }
        } catch (error) {
            toast.error('Image upload failed');
            return null;
        } finally {
            setIsUploadingFounder(false);
        }
    };

    const validateFounderForm = async (founderData: FounderInterface): Promise<boolean> => {
        try {
            await founderSchema.validate(founderData, { abortEarly: false });
            setFounderErrors({});
            return true;
        } catch (error: any) {
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


    const handleAddFounder = async () => {

        // if (!founder.photo) {
        //     toast.error('Please upload a founder photo');
        //     return;
        // }


        const isValid = await validateFounderForm(founder);
        if (isValid) {
            // setFormData((prev) => ({
            //     ...prev,
            //     founders: [...prev.founders, founder]
            // }));
            toast.success('Founder Added');
            setFounder(FoundersDto);
            setFounderErrors({});
        } else {
            toast.error('Please fix the errors before adding founder');
        }
    };

    return (
        <>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="">
                    <DialogHeader className="max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <DialogTitle className="text-[20px] font-bold text-[#344054]">
                            <p>Add Founder</p>
                            <div className="min-h-[80px] min-w-[80px] max-w-[120px] max-h-[120px] mt-4 relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                                {isUploadingFounder && (
                                    <div className="flex flex-col items-center">
                                        <LoaderCircle className="animate-spin text-blue-400 w-6 h-6" />
                                        <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                                    </div>
                                )}

                                {!isUploadingFounder && founder.photo === "" && (
                                    <p className="text-sm text-gray-500">No photo uploaded yet</p>
                                )}

                                {!isUploadingFounder && founder.photo !== "" && (
                                    <img
                                        src={founder.photo}
                                        alt="founder photo"
                                        className="object-contain rounded-lg w-full h-full"
                                        width={100}
                                        height={100}
                                    />
                                )}
                            </div>
                        </DialogTitle>
                        <div className="w-full grid grid-cols-1 gap-2">
                            {FoundersData.map((item, index) => (
                                <div key={index} className="gap-1.5 mb-3 sm:mb-3 lg:mb-4">
                                    <Label htmlFor={item.name} className="">
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
                                                        console.log('Uploading founder file:', file.name, file.size); // Debug log
                                                        await uploadFounderImage(file);
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
                                                    "w-full placeholder:font-figtree text-[14px] sm:text-[10px] lg:text-[13px] font-normal",
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
                                <p className="font-figtree font-semibold text-base md:text-[18px] text-[#005DFF] group-hover:text-[#fff] leading-[24px]">
                                    {/* {formdata.founders.length > 0 ? 'Add More' : 'Add'} */}
                                </p>
                            </button>
                            <button
                                type="button"
                                // onClick={() => {
                                //     setOpenDialog(false)
                                //     setFounder(FoundersDto)
                                // }}
                                className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-[#005DFF] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-[50px] w-full sm:w-auto hover:bg-[#004acc] transition-colors"
                            >
                                <p className="font-figtree font-semibold text-base md:text-[18px] text-[#fff] leading-[24px]">
                                    {/* {formdata.founders.length > 0 ? 'Done' : 'Cancel'} */}
                                </p>
                            </button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}