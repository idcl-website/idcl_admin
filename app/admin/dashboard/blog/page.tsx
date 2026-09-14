"use client"
import { Search, Eye, Trash2, SquarePen, Loader2, CircleX, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image";
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
import { blogService } from "@/services/blog";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { blogSchema } from "@/validation/blog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { formateDate } from "@/HelperFunctions/convertDate";
import { uploadToCloudinary } from "@/HelperFunctions/uploadToCloudinary";
import { BlogSkeleton } from "@/skeletons/blog";
import { HtmlPreview } from "@/components/blog/html-preview";


export interface Blogs {
    _id: string,
    image: string,
    title: string,
    snippet: string,
    body: string,
    createdAt: string,
    location: string,
    time: string,
    date: string,
    metaTitle?: string,
    metaDescription?: string,
    slug?: string,
    primaryKeywords?: string,
    secondaryKeywords?: string,
    publishedDate?: string,
    isPublished?: boolean,
    author?: string,
    tags?: string,
}

export default function TalentPage() {
    const router = useRouter();
    const [isfetching, setIsFetching] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isloadings, setIsLoadings] = useState({
        isdeleting: false,
        isediting: false
    })
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const [openEditDialogId, setOpenEditDialogId] = useState<string | null>(null);
    const [totalBlogs, setTotalBlog] = useState(0)
    const [blogs, setBlogs] = useState<Blogs[]>([])
    const [filteredBlogs, setFilteredBlogs] = useState<Blogs[]>([])
    const [date, setDate] = useState<Date>()
    const [filters, setfilters] = useState({
        search: '',
        time: 'all',
        date: 'all'
    })
    const [editImage, setEditImage] = useState<string | null>(null);
    const [newEditImage, setNewEditImage] = useState<string | null>(null);
    const [isImageUploading, setIsImageUploading] = useState(false);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const handleEditImageUpload = async (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`Image too large. Maximum size is 5 MB (your file: ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
            return;
        }

        try {
            setIsImageUploading(true);
            const ImageUrl = await uploadToCloudinary(file);
            if (ImageUrl) setNewEditImage(ImageUrl);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Upload failed. Please retry.");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsImageUploading(false);
        }
    };

    const deleteOldImage = async (url: string) => {
        try {
            await axios.post('/api/cloudinary/delete', { url });
        } catch (error) {
            console.error('Failed to delete old image:', error);
            throw error;
        }
    };

    useEffect(() => {
        const getAllBlogs = async () => {
            try {
                const data = await blogService.getAllBlogs(currentPage);
                console.log(data.blogs)
                setBlogs(data.blogs)
                setFilteredBlogs(data.blogs)
                // setHasMore(data.pagination.hasMore)
                setTotalPages(data.totalPages)
                setTotalBlog(data.totalBlogs)
                setCurrentPage(data.currentPage)
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

        getAllBlogs();
    }, [currentPage])

    useEffect(() => {
        let results = [...blogs]

        if (filters.search) {
            results = results.filter((blog) =>
                blog.snippet.toLowerCase().includes(filters.search.toLowerCase()) ||
                blog.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                blog.body.toLowerCase().includes(filters.search.toLowerCase()) ||
                blog.location.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        if (date !== undefined) {
            results = results.filter((blog) => blog.createdAt === formateDate(date))
        }

        setFilteredBlogs(results)
    }, [filters, date, blogs])



    const editFormik = useFormik({
        initialValues: {
            title: '',
            snippet: '',
            body: '',
            location: '',
            metaTitle: '',
            metaDescription: '',
            slug: '',
            primaryKeywords: '',
            secondaryKeywords: '',
            publishedDate: '',
            isPublished: false,
            author: '',
            tags: ''
        },
        validationSchema: blogSchema,
        onSubmit: async (values) => {
            if (!openEditDialogId) {
                toast.error('No blog selected for editing');
                return;
            }

            try {
                setIsLoadings(prev => ({ ...prev, isediting: true }));
                const image = newEditImage ?? editImage ?? undefined;
                await blogService.updateBlog(openEditDialogId, { ...values, image });
                setFilteredBlogs(prev => prev.map(blog =>
                    blog._id === openEditDialogId ? { ...blog, ...values, image: image ?? blog.image } : blog
                ));

                if (newEditImage && editImage) {
                    try {
                        await deleteOldImage(editImage);
                    } catch {
                        toast.warning('Post updated, but the old cover image could not be removed from storage.');
                    }
                }

                toast.success('Blog updated successfully');
                setOpenEditDialogId(null);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || "Failed to update blog");
                } else {
                    toast.error("An unexpected error occurred");
                }
            } finally {
                setIsLoadings(prev => ({ ...prev, isediting: false }));
            }
        },
    });

    // Reset form when dialog closes
    useEffect(() => {
        if (!openEditDialogId) {
            editFormik.resetForm();
            setEditImage(null);
            setNewEditImage(null);
        }
    }, [openEditDialogId]);

    useEffect(() => {
        if (openEditDialogId) {
            const blog = blogs.find(b => b._id === openEditDialogId);
            if (blog) {
                editFormik.setValues({
                    title: blog.title,
                    snippet: blog.snippet,
                    body: blog.body,
                    location: blog.location,
                    metaTitle: blog.metaTitle ?? '',
                    metaDescription: blog.metaDescription ?? '',
                    slug: blog.slug ?? '',
                    primaryKeywords: blog.primaryKeywords ?? '',
                    secondaryKeywords: blog.secondaryKeywords ?? '',
                    publishedDate: blog.publishedDate ?? '',
                    isPublished: blog.isPublished ?? false,
                    author: blog.author ?? '',
                    tags: blog.tags ?? ''
                });
                setEditImage(blog.image ?? null);
                setNewEditImage(null);
            }
        }
    }, [openEditDialogId, blogs]);

    if (isfetching) {
        return <BlogSkeleton />
    }

    return (
        <div className="space-y-4 md:space-y-6 ">
            {/* Search and Filters Section */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <Input
                        placeholder="Search posts..."
                        className="pl-9 h-10 bg-white border-gray-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-[#005DFF] w-full text-gray-500 focus:text-black"
                        value={filters.search}
                        onChange={(e) => setfilters((prev) => ({ ...prev, search: e.target.value }))}
                    />
                </div>

                {/* Date filter */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className={cn(
                            "h-10 flex items-center gap-2 px-3.5 rounded-lg border text-sm transition-colors bg-white",
                            date
                                ? "border-[#005DFF] text-[#005DFF]"
                                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}>
                            <CalendarIcon size={15} />
                            <span className="whitespace-nowrap">
                                {date ? format(date, "MMM d, yyyy") : "Filter by date"}
                            </span>
                            {date && (
                                <span
                                    role="button"
                                    onClick={(e) => { e.stopPropagation(); setDate(undefined); }}
                                    className="ml-1 rounded-full hover:bg-blue-100 p-0.5 transition-colors"
                                >
                                    <CircleX size={13} />
                                </span>
                            )}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 shadow-lg border-gray-100" align="end">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Talent Pool Section */}
            <section className="bg-white rounded-lg md:rounded-[10px] overflow-hidden">
                {/* Header */}
                <div className="w-full pt-4 md:pt-[16px] rounded-t-lg md:rounded-t-[10px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 md:pr-[19px] md:pb-[15px] md:pl-[19px] bg-[#fff]">
                    <div>
                        <div className="flex items-center gap-1 md:gap-[6.6px]">
                            <span className="text-[#101828] text-sm md:text-[16px] font-medium leading-5 md:leading-[23px]">Our News</span>
                            <p className="bg-[#F7FAFF] rounded-lg md:rounded-[13px] text-[#005DFF] text-xs md:text-[9px] font-inter font-medium leading-4 md:leading-[14px] py-0.5 md:py-1 px-2">
                                {totalBlogs}
                            </p>
                        </div>
                        <p className="text-[#667085] text-xs md:text-[12px] font-normal leading-4 md:leading-[16px]">
                            The events happening in IDCL
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/dashboard/blog/create')}
                        className="rounded-md md:rounded-[6.643px] border border-[0.83px] border-[#005DFF] bg-[#005DFF] shadow-sm md:shadow-[0px_0.83px_1.661px_rgba(16,24,40,0.05)] text-white flex items-center justify-center gap-1 md:gap-[6px] w-full sm:w-auto px-3 md:w-[99px] h-8 md:h-[33px] cursor-pointer"
                    >
                        <span className="font-inter text-[#fff] text-xs md:text-[11.626px] font-medium leading-4 md:leading-[16px]">Add</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                            <path
                                d="M8.47897 3.9248V13.6132M3.63477 8.76901H13.3232"
                                stroke="white"
                                strokeWidth="1.38683"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Table */}
                <div className=" px-4 py-6">
                    {filteredBlogs.length === 0 ? (
                        <div className="w-full text-center text-gray-500 text-sm sm:text-base">
                            No news articles match your search or filters.
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredBlogs.map((news, index) => (
                                <Card key={index} className="w-full relative h-[95vmin] hover:shadow-2xl transition-shadow">
                                    <CardHeader>
                                        <div className="w-full h-[50vmin] relative overflow-hidden rounded-md">
                                            <Image src={news.image} width={80} height={30} alt='news-photo' priority className="w-full h-full object-cover hover:scale-103 transition-transform duration-300" />
                                        </div>
                                        <CardTitle className="mb-4 line-clamp-1 sm:line-clamp-2">{news.title}</CardTitle>
                                        <CardDescription>
                                            <p className="line-clamp-4 sm:line-clamp-6 text-justify text-gray-400">
                                                {news.snippet}
                                            </p>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <p className="border-l border-l-2 border-red-500 px-2 capitalize">{news.location.toLowerCase()}</p>
                                            <div className="flex items-center gap-4">
                                                <p className="text-gray-400">{news.createdAt}</p>
                                                <p className="text-gray-400">{news.time}</p>
                                            </div>
                                         </div>

                                    </CardContent>
                                    <CardFooter className="flex items-center justify-between absolute bottom-2 w-full ">
                                        <Dialog
                                            open={openDialogId === news._id}
                                            onOpenChange={(open) => {
                                                setOpenDialogId(open ? news._id : null);
                                            }}
                                        >
                                            <DialogTrigger asChild>
                                                <button className="bg-green-500 p-2 w-10 h-10 border-none rounded-full cursor-pointer group hover:border hover:border-solid hover:border-green-500 hover:bg-transparent transition-all"><Eye className="text-white group-hover:text-green-500" /></button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-xl scrollbar-thin">
                                                {/* Cover image — full bleed flush to top */}
                                                <div className="w-full h-80 relative overflow-hidden">
                                                    <Image
                                                        src={news.image}
                                                        alt={news.title}
                                                        fill
                                                        priority
                                                        className="object-cover object-[0%_30%] hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>

                                                <div className="px-7 py-6 space-y-5">
                                                    {/* Meta */}
                                                    <div className="flex items-center gap-3 text-xs text-gray-400 uppercase tracking-wide">
                                                        <span className="border-l-2 border-red-400 pl-2 capitalize text-gray-500 font-medium">{news.location}</span>
                                                        <span>·</span>
                                                        <span>{news.createdAt}</span>
                                                        {news.time && <><span>·</span><span>{news.time}</span></>}
                                                    </div>

                                                    {/* Title */}
                                                    <DialogTitle asChild>
                                                        <h2 className="text-2xl font-bold text-gray-900 leading-snug">{news.title}</h2>
                                                    </DialogTitle>

                                                    {/* Excerpt */}
                                                    <p className="text-base font-medium text-gray-500 leading-relaxed border-l-4 border-[#005DFF] pl-4 italic">
                                                        {news.snippet}
                                                    </p>

                                                    <hr className="border-gray-100" />

                                                    {/* Body */}
                                                    <DialogDescription asChild>
                                                        <div className="text-gray-700 leading-relaxed text-[15px]">
                                                            <HtmlPreview html={news.body} />
                                                        </div>
                                                    </DialogDescription>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        setIsLoadings(prev => ({ ...prev, isdeleting: true }));
                                                        await blogService.deleteBlog(news._id);
                                                        setFilteredBlogs(prev => prev.filter(item => item._id !== news._id));
                                                        setTotalBlog(prev => prev - 1);
                                                        toast.success('News successfully deleted');
                                                    } catch (error) {
                                                        console.error(error)
                                                        toast.error('Failed to delete');
                                                    } finally {
                                                        setIsLoadings(prev => ({ ...prev, isdeleting: false }));
                                                    }
                                                }}
                                                className="bg-red-500 p-2 w-10 h-10 border-none rounded-full cursor-pointer group hover:border hover:border-solid hover:border-red-500 hover:bg-transparent transition-all"
                                            >
                                                {isloadings.isdeleting ? (
                                                    <Loader2 className="animate-spin text-white group-hover:text-red-500" />
                                                ) : (
                                                    <Trash2 className="text-white group-hover:text-red-500" />
                                                )}
                                            </button>
                                            <Dialog
                                                open={openEditDialogId === news._id}
                                                onOpenChange={(Open) => {
                                                    setOpenEditDialogId(Open ? news._id : null)
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <button className="bg-blue-500 p-2 w-10 h-10 border-none rounded-full cursor-pointer group hover:border hover:border-solid hover:border-blue-500 hover:bg-transparent transition-all">
                                                        <SquarePen className="text-white group-hover:text-blue-500" />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-h-[90vh] overflow-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit News</DialogTitle>
                                                        <DialogDescription>
                                                            Make all necessary changes before submitting
                                                        </DialogDescription>
                                                        <form onSubmit={editFormik.handleSubmit} className="w-full">
                                                            {/* Cover image */}
                                                            <div className="w-full mb-4">
                                                                <Label>Cover Image</Label>
                                                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 mt-2">
                                                                    {(newEditImage ?? editImage) ? (
                                                                        <Image
                                                                            src={newEditImage ?? editImage!}
                                                                            alt="Cover preview"
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">
                                                                            No cover image
                                                                        </div>
                                                                    )}
                                                                    {isImageUploading && (
                                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
                                                                            <Loader2 className="animate-spin text-white w-4 h-4" />
                                                                            <span className="text-white text-xs">Uploading...</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mt-2 flex flex-wrap items-center gap-3">
                                                                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-full cursor-pointer shadow-sm border border-gray-200 transition-colors">
                                                                        <ImagePlus size={13} />
                                                                        Change image
                                                                        <input
                                                                            type="file"
                                                                            accept=".jpg,.jpeg,.png,.svg"
                                                                            className="sr-only"
                                                                            onChange={async (e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) await handleEditImageUpload(file);
                                                                            }}
                                                                        />
                                                                    </label>
                                                                    {newEditImage && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setNewEditImage(null)}
                                                                            className="text-xs font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2"
                                                                        >
                                                                            Revert to original
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                {newEditImage && (
                                                                    <p className="text-xs text-gray-400 mt-1">The current image will be deleted from storage when you save.</p>
                                                                )}
                                                            </div>

                                                            <div className="w-full grid grid-cols-1 gap-2">
                                                                {/* Name Field */}
                                                                <div className={cn("gap-1.5 mb-4")}>
                                                                    <Label htmlFor='title'>Title</Label>
                                                                    <Input
                                                                        type='text'
                                                                        id='title'
                                                                        name='title'
                                                                        placeholder='enter title'
                                                                        className="w-full placeholder:font-figtree text-[16px] font-normal"
                                                                        value={editFormik.values.title}
                                                                        onChange={editFormik.handleChange}
                                                                        onBlur={editFormik.handleBlur}
                                                                    />
                                                                    {editFormik.touched.title && editFormik.errors.title && (
                                                                        <p className="text-red-500 text-xs mt-1">{editFormik.errors.title}</p>
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
                                                                        value={editFormik.values.location}
                                                                        onChange={editFormik.handleChange}
                                                                        onBlur={editFormik.handleBlur}
                                                                    />
                                                                    {editFormik.touched.location && editFormik.errors.location && (
                                                                        <p className="text-red-500 text-xs mt-1">{editFormik.errors.location}</p>
                                                                    )}
                                                                </div>

                                                                {/* Email Field */}
                                                                <div className={cn("gap-1.5 mb-4")}>
                                                                    <Label htmlFor='snippet'>Snippet</Label>
                                                                    <Textarea
                                                                        id='snippet'
                                                                        name='snippet'
                                                                        placeholder='enter tagline for news'
                                                                        value={editFormik.values.snippet}
                                                                        onChange={editFormik.handleChange}
                                                                        onBlur={editFormik.handleBlur}
                                                                        className={cn(
                                                                            "w-full min-h-[100px] sm:min-h-[110px] lg:min-h-[120px] text-sm sm:text-[15px] lg:text-[16px]",
                                                                            editFormik.errors.snippet && "border-red-500"
                                                                        )}
                                                                    />
                                                                    {editFormik.touched.snippet && editFormik.errors.snippet && (
                                                                        <p className="text-red-500 text-xs mt-1">{editFormik.errors.snippet}</p>
                                                                    )}
                                                                </div>

                                                                <div className={cn("gap-1.5 mb-4")}>
                                                                    <Label htmlFor='body'>body</Label>
                                                                    <Textarea
                                                                        id='body'
                                                                        name='body'
                                                                        placeholder='enter blog contents'
                                                                        value={editFormik.values.body}
                                                                        onChange={editFormik.handleChange}
                                                                        onBlur={editFormik.handleBlur}
                                                                        className={cn(
                                                                            "w-full min-h-[100px] sm:min-h-[110px] lg:min-h-[120px] text-sm sm:text-[15px] lg:text-[16px]",
                                                                            editFormik.errors.body && "border-red-500"
                                                                        )}

                                                                    />
                                                                    {editFormik.touched.body && editFormik.errors.body && (
                                                                        <p className="text-red-500 text-xs mt-1">{editFormik.errors.body}</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* SEO & Publishing */}
                                                            <div className="w-full mb-4">
                                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">SEO & Publishing</p>

                                                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                    <div className={cn("gap-1.5 mb-4 sm:col-span-2")}>
                                                                        <Label htmlFor='metaTitle'>Meta Title <span className="text-gray-400 font-normal text-xs">(~60 chars)</span></Label>
                                                                        <Input
                                                                            type='text'
                                                                            id='metaTitle'
                                                                            name='metaTitle'
                                                                            maxLength={60}
                                                                            placeholder='Founder Dojo Imo: 9 Startups Built in Imo State | IDCL'
                                                                            className="w-full placeholder:font-figtree text-[16px] font-normal"
                                                                            value={editFormik.values.metaTitle}
                                                                            onChange={editFormik.handleChange}
                                                                            onBlur={editFormik.handleBlur}
                                                                        />
                                                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                                                            <span>{editFormik.touched.metaTitle && editFormik.errors.metaTitle}</span>
                                                                            <span>{editFormik.values.metaTitle.length}/60</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className={cn("gap-1.5 mb-4 sm:col-span-2")}>
                                                                        <Label htmlFor='metaDescription'>Meta Description <span className="text-gray-400 font-normal text-xs">(~155 chars)</span></Label>
                                                                        <Textarea
                                                                            id='metaDescription'
                                                                            name='metaDescription'
                                                                            rows={2}
                                                                            maxLength={160}
                                                                            placeholder='Short SEO-friendly summary shown in search results'
                                                                            className="w-full min-h-[80px] text-sm sm:text-[15px]"
                                                                            value={editFormik.values.metaDescription}
                                                                            onChange={editFormik.handleChange}
                                                                            onBlur={editFormik.handleBlur}
                                                                        />
                                                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                                                            <span>{editFormik.touched.metaDescription && editFormik.errors.metaDescription}</span>
                                                                            <span>{editFormik.values.metaDescription.length}/160</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className={cn("gap-1.5 mb-4 sm:col-span-2")}>
                                                                        <Label htmlFor='slug'>URL Slug</Label>
                                                                        <Input
                                                                            type='text'
                                                                            id='slug'
                                                                            name='slug'
                                                                            placeholder='/founder-dojo-imo-9-startups-built-in-imo-state'
                                                                            className="w-full placeholder:font-figtree text-[16px] font-normal"
                                                                            value={editFormik.values.slug}
                                                                            onChange={editFormik.handleChange}
                                                                            onBlur={editFormik.handleBlur}
                                                                        />
                                                                        {editFormik.touched.slug && editFormik.errors.slug && (
                                                                            <p className="text-red-500 text-xs mt-1">{editFormik.errors.slug}</p>
                                                                        )}
                                                                    </div>

                                                                    <div className={cn("gap-1.5 mb-4")}>
                                                                        <Label htmlFor='primaryKeywords'>Primary Keywords</Label>
                                                                        <Input
                                                                            type='text'
                                                                            id='primaryKeywords'
                                                                            name='primaryKeywords'
                                                                            placeholder='Comma-separated'
                                                                            className="w-full placeholder:font-figtree text-[16px] font-normal"
                                                                            value={editFormik.values.primaryKeywords}
                                                                            onChange={editFormik.handleChange}
                                                                            onBlur={editFormik.handleBlur}
                                                                        />
                                                                    </div>

                                                                    <div className={cn("gap-1.5 mb-4")}>
                                                                        <Label htmlFor='secondaryKeywords'>Secondary Keywords</Label>
                                                                        <Input
                                                                            type='text'
                                                                            id='secondaryKeywords'
                                                                            name='secondaryKeywords'
                                                                            placeholder='Comma-separated'
                                                                            className="w-full placeholder:font-figtree text-[16px] font-normal"
                                                                            value={editFormik.values.secondaryKeywords}
                                                                            onChange={editFormik.handleChange}
                                                                            onBlur={editFormik.handleBlur}
                                                                        />
                                                                    </div>

                                                                    <div className={cn("gap-1.5 mb-4")}>
                                                                        <Label htmlFor='author'>Written By</Label>
                                                                        <Input
                                                                            type='text'
                                                                            id='author'
                                                                            name='author'
                                                                            placeholder='Primus Amaefule'
                                                                            className="w-full placeholder:font-figtree text-[16px] font-normal"
                                                                            value={editFormik.values.author}
                                                                            onChange={editFormik.handleChange}
                                                                            onBlur={editFormik.handleBlur}
                                                                        />
                                                                    </div>

                                                                    <div className={cn("gap-1.5 mb-4")}>
                                                                        <Label htmlFor='tags'>Suggested Tags</Label>
                                                                        <Input
                                                                            type='text'
                                                                            id='tags'
                                                                            name='tags'
                                                                            placeholder='#FounderDojoImo, #ImoDigitalCity'
                                                                            className="w-full placeholder:font-figtree text-[16px] font-normal"
                                                                            value={editFormik.values.tags}
                                                                            onChange={editFormik.handleChange}
                                                                            onBlur={editFormik.handleBlur}
                                                                        />
                                                                    </div>

                                                                    <div className={cn("gap-1.5 mb-4 sm:col-span-2")}>
                                                                        <Label>Published</Label>
                                                                        <div className="flex flex-wrap items-center gap-3">
                                                                            <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => editFormik.setFieldValue('isPublished', false)}
                                                                                    className={cn(
                                                                                        "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                                                                                        !editFormik.values.isPublished
                                                                                            ? "bg-white text-gray-900 shadow-sm"
                                                                                            : "text-gray-500 hover:text-gray-700"
                                                                                    )}
                                                                                >
                                                                                    Draft
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => editFormik.setFieldValue('isPublished', true)}
                                                                                    className={cn(
                                                                                        "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                                                                                        editFormik.values.isPublished
                                                                                            ? "bg-[#005DFF] text-white shadow-sm"
                                                                                            : "text-gray-500 hover:text-gray-700"
                                                                                    )}
                                                                                >
                                                                                    Published
                                                                                </button>
                                                                            </div>

                                                                            <Popover>
                                                                                <PopoverTrigger asChild>
                                                                                    <button
                                                                                        type="button"
                                                                                        className={cn(
                                                                                            "h-9 flex items-center gap-2 px-3 rounded-lg border text-sm bg-white transition-colors",
                                                                                            editFormik.values.publishedDate
                                                                                                ? "border-[#005DFF] text-[#005DFF]"
                                                                                                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                                                        )}
                                                                                    >
                                                                                        <CalendarIcon size={15} />
                                                                                        <span className="whitespace-nowrap">
                                                                                            {editFormik.values.publishedDate
                                                                                                ? format(new Date(editFormik.values.publishedDate), "MMM d, yyyy")
                                                                                                : "Pick publish date"}
                                                                                        </span>
                                                                                        {editFormik.values.publishedDate && (
                                                                                            <span
                                                                                                role="button"
                                                                                                onClick={(e) => { e.stopPropagation(); editFormik.setFieldValue('publishedDate', ''); }}
                                                                                                className="ml-1 rounded-full hover:bg-blue-100 p-0.5 transition-colors"
                                                                                            >
                                                                                                <CircleX size={13} />
                                                                                            </span>
                                                                                        )}
                                                                                    </button>
                                                                                </PopoverTrigger>
                                                                                <PopoverContent className="w-auto p-0 shadow-lg border-gray-100" align="start">
                                                                                    <Calendar
                                                                                        mode="single"
                                                                                        selected={editFormik.values.publishedDate ? new Date(editFormik.values.publishedDate) : undefined}
                                                                                        onSelect={(d) => editFormik.setFieldValue('publishedDate', d ? d.toISOString() : '')}
                                                                                        initialFocus
                                                                                    />
                                                                                </PopoverContent>
                                                                            </Popover>
                                                                        </div>
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

                                        </div>
                                    </CardFooter>
                                </Card>

                            ))}
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
                                {`${currentPage} of ${totalPages} ${totalPages > 1 ? 'pages' : 'page'}`}

                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </section>
        </div>
    )
}