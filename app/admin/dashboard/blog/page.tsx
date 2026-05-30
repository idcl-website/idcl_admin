"use client"
import { Search, Eye, Trash2, SquarePen, Loader2, CircleX } from "lucide-react";
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
import { BlogSkeleton } from "@/skeletons/blog";


export interface Blogs {
    _id: string,
    image: string,
    title: string,
    snippet: string,
    body: string,
    createdAt: string,
    location: string,
    time: string,
    date: string
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
            location: ''
        },
        validationSchema: blogSchema,
        onSubmit: async (values) => {
            if (!openEditDialogId) {
                toast.error('No blog selected for editing');
                return;
            }

            try {
                setIsLoadings(prev => ({ ...prev, isediting: true }));
                await blogService.updateBlog(openEditDialogId, values);
                setFilteredBlogs(prev => prev.map(blog =>
                    blog._id === openEditDialogId ? { ...blog, ...values } : blog
                ));
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
                    location: blog.location
                });
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
                                                        <div
                                                            className="text-gray-700 leading-relaxed text-[15px] space-y-3
                                                                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-6 [&_h1]:mb-2
                                                                [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:mt-5 [&_h2]:mb-2
                                                                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_h3]:mb-1
                                                                [&_p]:my-2 [&_p]:leading-relaxed
                                                                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4
                                                                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
                                                                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1
                                                                [&_a]:text-[#005DFF] [&_a]:underline [&_a]:underline-offset-2
                                                                [&_strong]:font-semibold [&_em]:italic"
                                                            dangerouslySetInnerHTML={{ __html: news.body }}
                                                        />
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