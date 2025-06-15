"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/ui/file-uploader";
import { useState } from 'react'
import { cn } from "@/lib/utils"
import back from "@/assets/icons/back.svg"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { talentSchema } from "@/validation/talent";
import { uploadToCloudinary } from "@/HelperFunctions/uploadToCloudinary";
import { useFormik } from 'formik';
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { TalentService } from "@/services/talent";

export default function AddTalent() {
    const router = useRouter();
    const [imageFile, setImageFile] = useState<string | undefined>(undefined);
    const [isUploading, setIsUploading] = useState(false)

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            track: '',
        },
        validationSchema: talentSchema,
        onSubmit: async (values) => {
            try {
                if (!imageFile) {
                    toast.error('Please upload an image');
                    return;
                }

                await TalentService.createTalent({ ...values, image: imageFile });
                toast.success('Talent created')
                formik.resetForm();
                setImageFile(undefined)
                router.push('/admin/dashboard/talent')
            } catch (error: any) {
                console.error('Submission error:', error);
                toast.error(error.response?.data?.message)
            }
        },
    });

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
                <form onSubmit={formik.handleSubmit} className="w-full">
                    <div className="w-full grid grid-cols-1 gap-2">
                        <div className="min-h-[80px] min-w-[80px] max-w-[120px] max-h-[120px] mt-4 relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                            {isUploading && (
                                <div className="flex flex-col items-center">
                                    <LoaderCircle className="animate-spin text-blue-400 w-6 h-6" />
                                    <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                                </div>
                            )}

                            {!isUploading && !imageFile && (
                                <p className="text-sm text-gray-500">No logo uploaded yet</p>
                            )}

                            {!isUploading && imageFile && (
                                <img
                                    src={imageFile}
                                    alt="start-up logo"
                                    className="object-contain rounded-lg"
                                    width={100}
                                    height={50}
                                />
                            )}
                        </div>
                        <div className={cn("gap-1.5 mb-3 sm:mb-3 lg:mb-4")}>
                            <FileUploader
                                accept="image/*"
                                maxSize={500 * 1024}
                                onDrop={async (files) => {
                                    const file = files[0];
                                    if (file) {
                                        try {
                                            setIsUploading(true)
                                            const ImageUrl = await uploadToCloudinary(file)

                                            if (ImageUrl) setImageFile(ImageUrl)
                                        } catch (error: any) {
                                            console.error(error.response?.data?.message)
                                            toast.error(error.response?.data?.message)
                                        } finally {
                                            setIsUploading(false)
                                        }
                                    }
                                }}
                            />
                        </div>

                        {/* Name Field */}
                        <div className={cn("gap-1.5 mb-3 sm:mb-3 lg:mb-4")}>
                            <Label htmlFor='name'>Name</Label>
                            <Input
                                type='text'
                                id='name'
                                name='name'
                                placeholder='enter talent name'
                                className="w-full placeholder:font-figtree text-[14px] sm:text-[10px] lg:text-[16px] font-normal"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className={cn("gap-1.5 mb-3 sm:mb-3 lg:mb-4")}>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                type='email'
                                id='email'
                                name='email'
                                placeholder='enter email address e.g idcl@gmail.com'
                                className="w-full placeholder:font-figtree text-[14px] sm:text-[10px] lg:text-[16px] font-normal"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                            )}
                        </div>

                        <div className={cn("gap-1.5 mb-3 sm:mb-3 lg:mb-4")}>
                            <Label htmlFor='track'>Track</Label>
                            <Input
                                type='text'
                                id='track'
                                name='track'
                                placeholder='enter track e.g Developer, Marketer'
                                className="w-full placeholder:font-figtree text-[14px] sm:text-[10px] lg:text-[16px] font-normal"
                                value={formik.values.track}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.track && formik.errors.track && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.track}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center md:col-span-2 gap-3 md:gap-[16px] w-full justify-end">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-transparent border border-[#004acc] rounded-[50px] w-full sm:w-auto group hover:bg-[#004acc]"
                        >
                            <p className="font-figtree font-semibold text-base md:text-[18px] text-[#005DFF] group-hover:text-[#fff] leading-[24px]">
                                Cancel
                            </p>
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting || !formik.isValid}
                            className="flex py-2 md:py-[10px] px-4 md:px-[24px] items-center justify-center gap-2 bg-[#005DFF] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-[50px] w-full sm:w-auto hover:bg-[#004acc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <p className="font-figtree font-semibold text-base md:text-[18px] text-[#fff] leading-[24px]">
                                {formik.isSubmitting ? 'Submitting...' : 'Submit'}
                            </p>
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
