"use client"
import { Search, Trash2, SquarePen, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import axios from "axios";
import { announcementService } from "@/services/announcement";
import { Announcement } from "@/types/announcement";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";


export default function AnnouncementsPage() {
    const router = useRouter();
    const [isfetching, setIsFetching] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isloadings, setIsLoadings] = useState({
        isdeleting: false,
        istoggliing: false,
        isediting: false
    })
    const [openEditDialogId, setOpenEditDialogId] = useState<string | null>(null);
    const [totalAnnouncements, setTotalAnnouncements] = useState(0)
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const getAllAnnouncements = async () => {
            try {
                const data = await announcementService.getAllAnnouncements(currentPage);
                setAnnouncements(data.data)
                setFilteredAnnouncements(data.data)
                setTotalPages(data.totalPages)
                setTotalAnnouncements(data.total)
                setCurrentPage(data.page)
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    const resError = error.response?.data?.message || "An error occurred. Retry"
                    console.error(resError);
                    toast.error(resError)
                } else {
                    console.error("An unexpected error occurred");
                }
            } finally {
                setIsFetching(false)
            }
        }

        getAllAnnouncements();
    }, [currentPage])

    useEffect(() => {
        let results = [...announcements]

        if (search) {
            results = results.filter((a) =>
                a.message.toLowerCase().includes(search.toLowerCase())
            )
        }

        setFilteredAnnouncements(results)
    }, [search, announcements])

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            setIsLoadings(prev => ({ ...prev, isdeleting: true }));
            await announcementService.deleteAnnouncement(id);
            setFilteredAnnouncements(prev => prev.filter(item => item._id !== id));
            setAnnouncements(prev => prev.filter(item => item._id !== id));
            setTotalAnnouncements(prev => prev - 1);
            toast.success('Announcement successfully deleted');
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete');
        } finally {
            setIsLoadings(prev => ({ ...prev, isdeleting: false }));
        }
    };

    const handleToggle = async (id: string) => {
        try {
            setIsLoadings(prev => ({ ...prev, istoggliing: true }));
            const updated = await announcementService.toggleAnnouncement(id);
            setAnnouncements(prev => prev.map(a => a._id === id ? updated : a));
            setFilteredAnnouncements(prev => prev.map(a => a._id === id ? updated : a));
            toast.success(`Announcement ${updated.isActive ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error(error)
            toast.error('Failed to toggle status');
        } finally {
            setIsLoadings(prev => ({ ...prev, istoggliing: false }));
        }
    };

    const editFormik = useFormik({
        initialValues: {
            message: '',
            order: 0,
            link: '',
            isActive: true
        },
        onSubmit: async (values) => {
            if (!openEditDialogId) {
                toast.error('No announcement selected for editing');
                return;
            }

            try {
                setIsLoadings(prev => ({ ...prev, isediting: true }));
                const updated = await announcementService.updateAnnouncement(openEditDialogId, values);
                setAnnouncements(prev => prev.map(a => a._id === openEditDialogId ? updated : a));
                setFilteredAnnouncements(prev => prev.map(a => a._id === openEditDialogId ? updated : a));
                toast.success('Announcement updated successfully');
                setOpenEditDialogId(null);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || "Failed to update announcement");
                } else {
                    toast.error("An unexpected error occurred");
                }
            } finally {
                setIsLoadings(prev => ({ ...prev, isediting: false }));
            }
        },
    });

    useEffect(() => {
        if (!openEditDialogId) {
            editFormik.resetForm();
        }
    }, [openEditDialogId]);

    useEffect(() => {
        if (openEditDialogId) {
            const announcement = announcements.find(a => a._id === openEditDialogId);
            if (announcement) {
                editFormik.setValues({
                    message: announcement.message,
                    order: announcement.order,
                    link: announcement.link ?? '',
                    isActive: announcement.isActive
                });
            }
        }
    }, [openEditDialogId, announcements]);

    if (isfetching) {
        return (
            <div className="space-y-4 md:space-y-6">
                <div className="bg-white rounded-lg md:rounded-[10px] overflow-hidden">
                    <div className="w-full pt-4 md:pt-[16px] flex justify-between items-center px-4 sm:px-5 md:px-[19px]">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-[140px] bg-gray-100" />
                            <Skeleton className="h-4 w-[200px] bg-gray-100" />
                        </div>
                        <Skeleton className="h-8 w-[99px] bg-gray-100" />
                    </div>
                    <div className="px-4 py-6 space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-full bg-gray-100 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 md:space-y-6 ">
            {/* Search Section */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <Input
                        placeholder="Search announcements..."
                        className="pl-9 h-10 bg-white border-gray-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-[#005DFF] w-full text-gray-500 focus:text-black"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Announcements Table Section */}
            <section className="bg-white rounded-lg md:rounded-[10px] overflow-hidden">
                {/* Header */}
                <div className="w-full pt-4 md:pt-[16px] rounded-t-lg md:rounded-t-[10px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 md:pr-[19px] md:pb-[15px] md:pl-[19px] bg-[#fff]">
                    <div>
                        <div className="flex items-center gap-1 md:gap-[6.6px]">
                            <span className="text-[#101828] text-sm md:text-[16px] font-medium leading-5 md:leading-[23px]">Announcements</span>
                            <p className="bg-[#F7FAFF] rounded-lg md:rounded-[13px] text-[#005DFF] text-xs md:text-[9px] font-inter font-medium leading-4 md:leading-[14px] py-0.5 md:py-1 px-2">
                                {totalAnnouncements}
                            </p>
                        </div>
                        <p className="text-[#667085] text-xs md:text-[12px] font-normal leading-4 md:leading-[16px]">
                            Manage the scrolling ticker on the public news page
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/dashboard/announcements/create')}
                        className="rounded-md md:rounded-[6.643px] border border-[0.83px] border-[#005DFF] bg-[#005DFF] shadow-sm md:shadow-[0px_0.83px_1.661px_rgba(16,24,40,0.05)] text-white flex items-center justify-center gap-1 md:gap-[6px] w-full sm:w-auto px-3 md:w-[99px] h-8 md:h-[33px] cursor-pointer"
                    >
                        <span className="font-inter text-[#fff] text-xs md:text-[11.626px] font-medium leading-4 md:leading-[16px]">Add</span>
                        <Plus size={14} />
                    </button>
                </div>

                {/* Table */}
                <div className="px-4 py-6">
                    {filteredAnnouncements.length === 0 ? (
                        <div className="w-full text-center text-gray-500 text-sm sm:text-base">
                            No announcements found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAnnouncements.map((announcement) => (
                                        <tr key={announcement._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 px-3">
                                                <p className="text-gray-900 truncate max-w-[300px]" title={announcement.message}>
                                                    {announcement.message}
                                                </p>
                                                {announcement.link && (
                                                    <p className="text-gray-400 text-xs truncate max-w-[300px]" title={announcement.link}>
                                                        {announcement.link}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-gray-600">{announcement.order}</td>
                                            <td className="py-3 px-3">
                                                <Badge variant={announcement.isActive ? "default" : "secondary"}>
                                                    {announcement.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-3 text-gray-400 text-xs whitespace-nowrap">{announcement.createdAt}</td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Dialog
                                                        open={openEditDialogId === announcement._id}
                                                        onOpenChange={(open) => {
                                                            setOpenEditDialogId(open ? announcement._id : null)
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <button className="bg-blue-500 p-2 w-8 h-8 border-none rounded-full cursor-pointer group hover:border hover:border-solid hover:border-blue-500 hover:bg-transparent transition-all">
                                                                <SquarePen className="text-white group-hover:text-blue-500 w-4 h-4" />
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-h-[90vh] overflow-auto">
                                                            <DialogHeader>
                                                                <DialogTitle>Edit Announcement</DialogTitle>
                                                                <DialogDescription>
                                                                    Make all necessary changes before submitting
                                                                </DialogDescription>
                                                                <form onSubmit={editFormik.handleSubmit} className="w-full mt-4">
                                                                    <div className="w-full grid grid-cols-1 gap-4">
                                                                        <div className="gap-1.5">
                                                                            <Label htmlFor='edit-message'>Message</Label>
                                                                            <Textarea
                                                                                id='edit-message'
                                                                                name='message'
                                                                                placeholder='Enter announcement message'
                                                                                value={editFormik.values.message}
                                                                                onChange={editFormik.handleChange}
                                                                                onBlur={editFormik.handleBlur}
                                                                                className={cn(
                                                                                    "w-full min-h-[100px] text-sm",
                                                                                    editFormik.errors.message && "border-red-500"
                                                                                )}
                                                                            />
                                                                            {editFormik.touched.message && editFormik.errors.message && (
                                                                                <p className="text-red-500 text-xs mt-1">{editFormik.errors.message}</p>
                                                                            )}
                                                                        </div>

                                                                        <div className="gap-1.5">
                                                                            <Label htmlFor='edit-order'>Order</Label>
                                                                            <Input
                                                                                type='number'
                                                                                id='edit-order'
                                                                                name='order'
                                                                                placeholder='0'
                                                                                value={editFormik.values.order}
                                                                                onChange={editFormik.handleChange}
                                                                                onBlur={editFormik.handleBlur}
                                                                                className="w-full text-sm"
                                                                            />
                                                                        </div>

                                                                        <div className="gap-1.5">
                                                                            <Label htmlFor='edit-link'>Link (optional)</Label>
                                                                            <Input
                                                                                type='text'
                                                                                id='edit-link'
                                                                                name='link'
                                                                                placeholder='https://...'
                                                                                value={editFormik.values.link}
                                                                                onChange={editFormik.handleChange}
                                                                                onBlur={editFormik.handleBlur}
                                                                                className="w-full text-sm"
                                                                            />
                                                                        </div>

                                                                        <div className="gap-1.5">
                                                                            <Label>Status</Label>
                                                                            <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => editFormik.setFieldValue('isActive', false)}
                                                                                    className={cn(
                                                                                        "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                                                                                        !editFormik.values.isActive
                                                                                            ? "bg-white text-gray-900 shadow-sm"
                                                                                            : "text-gray-500 hover:text-gray-700"
                                                                                    )}
                                                                                >
                                                                                    Inactive
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => editFormik.setFieldValue('isActive', true)}
                                                                                    className={cn(
                                                                                        "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                                                                                        editFormik.values.isActive
                                                                                            ? "bg-[#005DFF] text-white shadow-sm"
                                                                                            : "text-gray-500 hover:text-gray-700"
                                                                                    )}
                                                                                >
                                                                                    Active
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-end mt-6">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setOpenEditDialogId(null)}
                                                                            className="flex py-[10px] px-[24px] items-center justify-center gap-2 bg-transparent border border-[#004acc] rounded-[50px] w-full sm:w-auto group hover:bg-[#004acc] transition-colors"
                                                                        >
                                                                            <p className="font-figtree font-semibold text-[18px] text-[#005DFF] group-hover:text-[#fff] leading-[24px]">
                                                                                Cancel
                                                                            </p>
                                                                        </button>
                                                                        <button
                                                                            type="submit"
                                                                            disabled={editFormik.isSubmitting || !editFormik.isValid}
                                                                            className="flex py-[10px] px-[24px] items-center justify-center gap-2 bg-[#005DFF] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-[50px] w-full sm:w-auto hover:bg-[#004acc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        >
                                                                            <p className="font-figtree font-semibold text-[18px] text-[#fff] leading-[24px]">
                                                                                {editFormik.isSubmitting ? 'Updating...' : 'Update'}
                                                                            </p>
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <button
                                                        onClick={() => handleToggle(announcement._id)}
                                                        disabled={isloadings.istoggliing}
                                                        className={cn(
                                                            "p-2 w-8 h-8 border-none rounded-full cursor-pointer group transition-all",
                                                            announcement.isActive
                                                                ? "bg-yellow-500 hover:border hover:border-solid hover:border-yellow-500 hover:bg-transparent"
                                                                : "bg-green-500 hover:border hover:border-solid hover:border-green-500 hover:bg-transparent"
                                                        )}
                                                    >
                                                        {isloadings.istoggliing ? (
                                                            <Loader2 className="animate-spin text-white w-4 h-4" />
                                                        ) : (
                                                            <span className={cn(
                                                                "text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center",
                                                                announcement.isActive ? "group-hover:text-yellow-500" : "group-hover:text-green-500"
                                                            )}>
                                                                {announcement.isActive ? 'OFF' : 'ON'}
                                                            </span>
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(announcement._id)}
                                                        disabled={isloadings.isdeleting}
                                                        className="bg-red-500 p-2 w-8 h-8 border-none rounded-full cursor-pointer group hover:border hover:border-solid hover:border-red-500 hover:bg-transparent transition-all"
                                                    >
                                                        {isloadings.isdeleting ? (
                                                            <Loader2 className="animate-spin text-white group-hover:text-red-500 w-4 h-4" />
                                                        ) : (
                                                            <Trash2 className="text-white group-hover:text-red-500 w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="py-4 px-4 md:px-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                    }}
                                    aria-disabled={currentPage === 1}
                                    className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                                />
                            </PaginationItem>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page);
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            {totalPages > 5 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                    }}
                                    aria-disabled={currentPage === totalPages}
                                    className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </section>
        </div>
    )
}
