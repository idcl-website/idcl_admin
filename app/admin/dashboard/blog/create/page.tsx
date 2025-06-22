"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/ui/file-uploader";
import { useState } from 'react'
import { cn } from "@/lib/utils"
import back from "@/assets/icons/back.svg"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { blogSchema } from "@/validation/blog";
import { uploadToCloudinary } from "@/HelperFunctions/uploadToCloudinary";
import { useFormik } from 'formik';
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { blogService } from "@/services/blog";


export default function CreateBlog() {
    const router = useRouter();
    const [imageFile, setImageFile] = useState<string | undefined>(undefined);
    const [isUploading, setIsUploading] = useState(false)

    const formik = useFormik({
        initialValues: {
            title: '',
            snippet: '',
            body: '',
            location: ''
        },
        validationSchema: blogSchema,
        onSubmit: async (values) => {
            console.log(values)
            try {
                if (!imageFile) {
                    toast.error('Please upload an image');
                    return;
                }

                await blogService.createBlog({ ...values, image: imageFile });
                toast.success('Blog created')
                formik.resetForm();
                setImageFile(undefined);
                router.push('/admin/dashboard/blog')
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error(error.response?.data?.message || "An error occurred. Retry");
                    toast.error(error.response?.data?.message)
                } else {
                    console.error("An unexpected error occurred");
                }
            }
        },
    });

    return (
        <main className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-0">
            <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-6 items-start justify-center mb-6">
                <button
                    onClick={() => router.back()}
                    className="self-start lg:self-auto mt-4 lg:mt-0"
                >
                    <Image
                        src={back}
                        alt="Back-Button"
                        width={40}
                        height={40}
                        className="object-cover"
                    />
                </button>
                <div className="bg-[#fff] w-full rounded-[16px] shadow-lg p-6 lg:p-[32px]">
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
                                    <Image
                                        src={imageFile}
                                        alt="start-up logo"
                                        className="object-contain rounded-lg"
                                        width={100}
                                        height={50}
                                        priority
                                    />
                                )}
                            </div>
                            <div className={cn("gap-1.5 mb-4")}>
                                <FileUploader
                                    accept="image/*"
                                    maxSize={2 * 1024 * 1024}
                                    onDrop={async (files) => {
                                        const file = files[0];
                                        if (file) {
                                            try {
                                                setIsUploading(true)
                                                const ImageUrl = await uploadToCloudinary(file)
                                                console.log(ImageUrl)
                                                if (ImageUrl) setImageFile(ImageUrl)
                                            } catch (error: unknown) {
                                                if (axios.isAxiosError(error)) {
                                                    const resError = error.response?.data?.message || "An error occurred. Retry"
                                                    console.error(resError);
                                                    toast.error(resError)
                                                } else {
                                                    console.error("An unexpected error occurred");
                                                }
                                            } finally {
                                                setIsUploading(false)
                                            }
                                        }
                                    }}
                                />
                            </div>

                            {/* Name Field */}
                            <div className={cn("gap-1.5 mb-4")}>
                                <Label htmlFor='title'>Title</Label>
                                <Input
                                    type='text'
                                    id='title'
                                    name='title'
                                    placeholder='enter title'
                                    className="w-full placeholder:font-figtree text-[16px] font-normal"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.title && formik.errors.title && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                                )}
                            </div>

                            <div className={cn("gap-1.5 mb-4")}>
                                <Label htmlFor='location'>Location</Label>
                                <Input
                                    type='text'
                                    id='location'
                                    name='location'
                                    placeholder='Enter location'
                                    className="w-full placeholder:font-figtree text-[16px] font-normal"
                                    value={formik.values.location}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.location && formik.errors.location && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.location}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className={cn("gap-1.5 mb-4")}>
                                <Label htmlFor='snippet'>Snippet</Label>
                                <Textarea
                                    id='snippet'
                                    name='snippet'
                                    placeholder='enter tagline for news'
                                    value={formik.values.snippet}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={cn(
                                        "w-full min-h-[100px] sm:min-h-[110px] lg:min-h-[120px] text-sm sm:text-[15px] lg:text-[16px]",
                                        formik.errors.snippet && "border-red-500"
                                    )}
                                />
                                {formik.touched.snippet && formik.errors.snippet && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.snippet}</p>
                                )}
                            </div>

                            <div className={cn("gap-1.5 mb-4")}>
                                <Label htmlFor='body'>body</Label>
                                <Textarea
                                    id='body'
                                    name='body'
                                    placeholder='enter blog contents'
                                    value={formik.values.body}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={cn(
                                        "w-full min-h-[100px] sm:min-h-[110px] lg:min-h-[120px] text-sm sm:text-[15px] lg:text-[16px]",
                                        formik.errors.body && "border-red-500"
                                    )}

                                />
                                {formik.touched.body && formik.errors.body && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.body}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex py-[10px] px-[24px] items-center justify-center gap-2 bg-transparent border border-[#004acc] rounded-[50px] w-full sm:w-auto group hover:bg-[#004acc] transition-colors"
                            >
                                <p className="font-figtree font-semibold text-[18px] text-[#005DFF] group-hover:text-[#fff] leading-[24px]">
                                    Cancel
                                </p>
                            </button>
                            <button
                                type="submit"
                                disabled={formik.isSubmitting || !formik.isValid}
                                className="flex py-[10px] px-[24px] items-center justify-center gap-2 bg-[#005DFF] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-[50px] w-full sm:w-auto hover:bg-[#004acc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <p className="font-figtree font-semibold text-[18px] text-[#fff] leading-[24px]">
                                    {formik.isSubmitting ? 'Submitting...' : 'Submit'}
                                </p>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}