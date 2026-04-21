"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/ui/file-uploader";
import { useRef, useState } from 'react'
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { blogSchema } from "@/validation/blog";
import { uploadToCloudinary } from "@/HelperFunctions/uploadToCloudinary";
import { useFormik } from 'formik';
import { ArrowLeft, ImagePlus, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { blogService } from "@/services/blog";
import { RichTextControllers } from "./richTextControllers";
import { TooltipProvider } from "@/components/ui/tooltip";


export default function CreateBlog() {
    const router = useRouter();
    const [imageFile, setImageFile] = useState<string | undefined>(undefined);
    const [isUploading, setIsUploading] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null);

    const MIN_WIDTH = 800;
    const MIN_HEIGHT = 400;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const handleImageUpload = async (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`Image too large. Maximum size is 5 MB (your file: ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
            return;
        }

        // Check dimensions before uploading
        const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
            const url = URL.createObjectURL(file);
            const img = new window.Image();
            img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
                URL.revokeObjectURL(url);
            };
            img.src = url;
        });

        if (dimensions.width < MIN_WIDTH || dimensions.height < MIN_HEIGHT) {
            toast.error(`Image too small. Minimum size is ${MIN_WIDTH}×${MIN_HEIGHT}px (uploaded: ${dimensions.width}×${dimensions.height}px).`);
            return;
        }

        try {
            setIsUploading(true);
            const ImageUrl = await uploadToCloudinary(file);
            if (ImageUrl) setImageFile(ImageUrl);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Upload failed. Please retry.");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsUploading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            snippet: '',
            body: '',
            location: ''
        },
        validationSchema: blogSchema,
        onSubmit: async (values) => {
            try {
                if (!imageFile) {
                    toast.error('Please upload a cover image');
                    return;
                }

                await blogService.createBlog({ ...values, image: imageFile });
                toast.success('Blog post published')
                formik.resetForm();
                setImageFile(undefined);
                if (editorRef.current) editorRef.current.innerHTML = '';
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
        <TooltipProvider>
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-16">

                {/* Page header */}
                <div className="flex items-center justify-between py-6 border-b border-gray-100 mb-8">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <h1 className="text-base font-semibold text-gray-900">New Blog Post</h1>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            form="blog-form"
                            disabled={formik.isSubmitting || !formik.isValid}
                            className="px-4 py-1.5 text-sm font-medium text-white bg-[#005DFF] rounded-full hover:bg-[#004acc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {formik.isSubmitting ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </div>

                <form id="blog-form" onSubmit={formik.handleSubmit} className="space-y-8">

                    {/* Cover Image */}
                    <section>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Cover Image</p>

                        {imageFile ? (
                            /* — Image selected state — */
                            <div className="relative w-full h-[300px] rounded-xl overflow-hidden group border-dashed border-1 p-2 border-gray-400">
                                <Image
                                    src={imageFile}
                                    alt="Cover image"
                                    className="w-fit m-auto h-full object-contain border-1 border-dashed border-gray-400 rounded-lg"
                                    width={1280}
                                    height={200}
                                    priority
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
                                        <LoaderCircle className="animate-spin text-white w-4 h-4" />
                                        <span className="text-white text-xs">Uploading...</span>
                                    </div>
                                )}
                                {!isUploading && (
                                    <div className="absolute bottom-3 right-3">
                                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-700 text-xs font-medium rounded-full cursor-pointer shadow transition-colors">
                                            <ImagePlus size={13} />
                                            Change image
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.svg"
                                                className="sr-only"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) await handleImageUpload(file);
                                                }}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* — Empty / dropzone state — */
                            <div className="relative">
                                {isUploading ? (
                                    <div className="w-full h-[120px] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <LoaderCircle className="animate-spin text-[#005DFF] w-5 h-5" />
                                        <p className="text-xs">Uploading...</p>
                                    </div>
                                ) : (
                                    <FileUploader
                                        accept="image/jpeg,image/png,image/svg+xml"
                                        onDrop={async (files) => {
                                            const file = files[0];
                                            if (file) await handleImageUpload(file);
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </section>

                    {/* Post details */}
                    <section className="space-y-5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Post Details</p>

                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Enter a compelling title"
                                className={cn(
                                    "text-base h-11",
                                    formik.touched.title && formik.errors.title && "border-red-400 focus-visible:ring-red-400"
                                )}
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <p className="text-red-500 text-xs">{formik.errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="e.g. Lagos, Nigeria"
                                className={cn(
                                    "text-base h-11",
                                    formik.touched.location && formik.errors.location && "border-red-400 focus-visible:ring-red-400"
                                )}
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.location && formik.errors.location && (
                                <p className="text-red-500 text-xs">{formik.errors.location}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="snippet" className="text-sm font-medium text-gray-700">
                                Excerpt
                                <span className="ml-1.5 text-gray-400 font-normal text-xs">(shown in post previews)</span>
                            </Label>
                            <Textarea
                                id="snippet"
                                name="snippet"
                                placeholder="Write a short summary of the post..."
                                rows={3}
                                className={cn(
                                    "resize-none text-base leading-relaxed",
                                    formik.touched.snippet && formik.errors.snippet && "border-red-400 focus-visible:ring-red-400"
                                )}
                                value={formik.values.snippet}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.snippet && formik.errors.snippet && (
                                <p className="text-red-500 text-xs">{formik.errors.snippet}</p>
                            )}
                        </div>
                    </section>

                    {/* Body / Rich text editor */}
                    <section className="space-y-1.5">
                        <Label htmlFor="body" className="text-sm font-medium text-gray-700">Content</Label>
                        <div className={cn(
                            "rounded-xl border border-gray-200 overflow-hidden",
                            formik.touched.body && formik.errors.body && "border-red-400"
                        )}>
                            {/* Sticky toolbar */}
                            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-3 py-2">
                                <RichTextControllers />
                            </div>
                            <div className="relative">
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={(e) => {
                                        // Strip browser-injected class/style attributes from execCommand
                                        const clean = e.currentTarget.innerHTML
                                            .replace(/ class="[^"]*"/g, '')
                                            .replace(/ style="[^"]*"/g, '');
                                        formik.setFieldValue('body', clean);
                                    }}
                                    onBlur={() => formik.setFieldTouched('body', true)}
                                    className="min-h-[400px] text-base leading-relaxed p-4 outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline"
                                />
                                {!formik.values.body && (
                                    <p className="absolute top-4 left-4 text-gray-400 text-base pointer-events-none select-none">
                                        Start writing your post...
                                    </p>
                                )}
                            </div>
                        </div>
                        {formik.touched.body && formik.errors.body && (
                            <p className="text-red-500 text-xs">{formik.errors.body}</p>
                        )}
                    </section>

                </form>
            </div>
        </TooltipProvider>
    )
}