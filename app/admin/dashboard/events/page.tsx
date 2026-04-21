"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventService } from '@/services/event';
import { EventItem } from '@/types/event';
import EventDisplay from '@/components/dashboard/event';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


const eventCategories = [
    "All",
    "Conference",
    "Workshop",
    "Webinar",
    "Meetup",
    "Seminar",
    "Hackathon",
    "Networking",
    "Panel Discussion",
    "Expo",
    "Other"
];

export default function EventsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalEvents, setTotalEvents] = useState(0);
    const [category, setCategory] = useState('All');
    const [events, setEvents] = useState<EventItem[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = (id: string) => {
        setFilteredEvents((prev: EventItem[])=> prev.filter((event: EventItem)=> event._id !== id))
    }

    // Filtering logic
    useEffect(()=>{
        setFilteredEvents(events.filter(event => {
            const matchesSearch =
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = category === "All" ? true : event.category === category;

            const matchesStartDate = startDate
                ? new Date(event.startDate).toDateString() === startDate.toDateString()
                : true;

            return matchesSearch && matchesCategory && matchesStartDate;
        }));
    }, [events, searchQuery, category, startDate])

    // Pagination handler
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await eventService.getAllEvents(currentPage);
                setEvents(response.data || []);
                setCurrentPage(response.page);
                setTotalPages(response.totalPages);
                setTotalEvents(response.total);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        getEvents();
    }, [currentPage]);

    return (
        <div className="space-y-4 md:space-y-6 md:p-0">
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row items-start h-auto gap-4 md:gap-[40px]">
                <div className="w-full md:max-w-[949px] bg-white p-1 rounded-lg md:rounded-[10px]">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-[20px]">
                        {/* Search Input */}
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search"
                                className="pl-10 rounded-lg md:rounded-[16px] w-full bg-white text-sm md:text-base"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="w-full max-w-xs">
                            <div className="h-[35px] w-full rounded-lg md:rounded-[8px] py-1.5 md:py-[5px] px-2 md:px-[12px] bg-[#F0F2F5] flex items-center gap-3 md:gap-4">
                                <p className="font-inter font-normal text-xs md:text-[10px] leading-[14px] capitalize text-[#667085] whitespace-nowrap mr-2">
                                    Category
                                </p>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger
                                        className="h-[32px] min-w-[160px] rounded-sm md:rounded-[4px] bg-white flex items-center justify-between focus:ring-0 focus:ring-offset-0 data-[state=open]:bg-[#E1ECFF] text-xs md:text-[10px]"
                                    >
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="rounded-lg md:rounded-[16px] border border-[#D0D5DD] bg-[#E1ECFF] min-w-[220px] w-[220px]"
                                        position="popper"
                                        align="end"
                                    >
                                        {eventCategories.map((option, idx) => (
                                            <SelectItem
                                                key={idx}
                                                value={option}
                                                className="font-inter font-medium text-xs md:text-[10px] focus:bg-[#D0D5DD]"
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Start Date Filter */}
                        <div className="w-full max-w-xs">
                            <div className="h-[35px] w-full rounded-lg md:rounded-[8px] py-1.5 md:py-[5px] px-2 md:px-[12px] bg-[#F0F2F5] flex items-center gap-3 md:gap-4">
                                <p className="font-inter font-normal text-xs md:text-[10px] leading-[14px] capitalize text-[#667085] whitespace-nowrap mr-2">
                                    Start Date
                                </p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className="h-[32px] min-w-[160px] rounded-sm md:rounded-[4px] bg-white flex items-center justify-between px-3 text-xs md:text-[10px] border border-gray-300"
                                        >
                                            {startDate ? format(startDate, "dd MMM yyyy") : "Pick date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate || undefined}
                                            onSelect={date => setStartDate(date ?? null)}
                                            initialFocus
                                            required={false}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {startDate && (
                                    <button
                                        type="button"
                                        className="ml-2 text-xs text-gray-400 hover:text-gray-600"
                                        onClick={() => setStartDate(null)}
                                        title="Clear date"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add New Button */}
                <button
                    onClick={() => router.push('/admin/dashboard/events/create')}
                    className="bg-[#005EFF] w-full md:w-[123px] py-2 md:py-[11px] px-4 md:px-[20px] rounded-lg md:rounded-[10px] cursor-pointer hover:bg-[#0050D6] transition-colors"
                >
                    <span className="font-roboto text-white text-sm md:text-[15px] font-medium leading-normal">Add New</span>
                </button>
            </div>

            {/* Events Count Header */}
            <div className="flex items-center justify-between px-2 md:px-0">
                <h2 className="text-lg md:text-xl font-semibold text-[#101828]">
                    Events <span className="text-[#005DFF]">({filteredEvents.length})</span>
                </h2>
                {/* Optionally, you can show totalEvents if you want the total from all pages */}
                <span className="text-xs text-gray-500">Total: {totalEvents}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[39px]">
                {filteredEvents.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <p className="text-gray-500 text-lg font-semibold">No events found.</p>
                    </div>
                ) : (
                    filteredEvents.map((event, index) => {
                        console.log(event)
                        return (
                            <div key={index} className="w-full max-w-[362px] mx-auto">
                                <EventDisplay
                                    id={event._id}
                                    image={event.image}
                                    name={event.name}
                                    description={event.description}
                                    tagline={event.tagline}
                                    category={event.category}
                                    day={new Date(event.startDate).getDate().toString()}
                                    month={new Date(event.startDate).toLocaleString('default', { month: 'long' })}
                                    time={new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    handleDelete={handleDelete}
                                />
                            </div>
                        )
                    })
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        isActive={currentPage === i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}