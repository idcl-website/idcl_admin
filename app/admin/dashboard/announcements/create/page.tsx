"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from 'react'
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { announcementService } from "@/services/announcement";
import { useFormik } from 'formik';


export default function CreateAnnouncement() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            message: '',
            order: 0,
            link: '',
            isActive: true
        },
        onSubmit: async (values) => {
            try {
                setIsSubmitting(true);
                await announcementService.createAnnouncement({
                    message: values.message,
                    order: values.order || undefined,
                    link: values.link || undefined,
                    isActive: values.isActive
                });
                toast.success('Announcement created successfully')
                formik.resetForm();
                router.push('/admin/dashboard/announcements')
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error(error.response?.data?.message || "An error occurred. Retry");
                    toast.error(error.response?.data?.message)
                } else {
                    console.error("An unexpected error occurred");
                }
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
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
                <h1 className="text-base font-semibold text-gray-900">New Announcement</h1>
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
                        form="announcement-form"
                        disabled={isSubmitting || !formik.isValid}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-[#005DFF] rounded-full hover:bg-[#004acc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>

            <form id="announcement-form" onSubmit={formik.handleSubmit} className="space-y-8">

                {/* Announcement Details */}
                <section className="space-y-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Announcement Details</p>

                    <div className="space-y-1.5">
                        <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Enter the announcement message to display on the ticker..."
                            rows={4}
                            className={cn(
                                "resize-none text-base leading-relaxed",
                                formik.touched.message && formik.errors.message && "border-red-400 focus-visible:ring-red-400"
                            )}
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.message && formik.errors.message && (
                            <p className="text-red-500 text-xs">{formik.errors.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="order" className="text-sm font-medium text-gray-700">
                                Order
                                <span className="ml-1.5 text-gray-400 font-normal text-xs">(lower = shown first)</span>
                            </Label>
                            <Input
                                id="order"
                                name="order"
                                type="number"
                                placeholder="0"
                                className={cn(
                                    "text-base h-11",
                                    formik.touched.order && formik.errors.order && "border-red-400 focus-visible:ring-red-400"
                                )}
                                value={formik.values.order}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="link" className="text-sm font-medium text-gray-700">
                                Link
                                <span className="ml-1.5 text-gray-400 font-normal text-xs">(optional)</span>
                            </Label>
                            <Input
                                id="link"
                                name="link"
                                type="url"
                                placeholder="https://..."
                                className={cn(
                                    "text-base h-11",
                                    formik.touched.link && formik.errors.link && "border-red-400 focus-visible:ring-red-400"
                                )}
                                value={formik.values.link}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">Status</Label>
                        <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5">
                            <button
                                type="button"
                                onClick={() => formik.setFieldValue('isActive', false)}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                                    !formik.values.isActive
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                Inactive
                            </button>
                            <button
                                type="button"
                                onClick={() => formik.setFieldValue('isActive', true)}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                                    formik.values.isActive
                                        ? "bg-[#005DFF] text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                Active
                            </button>
                        </div>
                    </div>
                </section>

            </form>
        </div>
    )
}
