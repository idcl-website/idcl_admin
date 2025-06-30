"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventService } from '@/services/event';
import { EventItem } from '@/types/event';
import EventDisplay from '@/components/dashboard/event';

const eventCategories = [
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
    const [currentPage, setCurrentPage] = useState(1); // Assuming pagination is needed
    const [totalPages, setTotalPages] = useState(0); // State to hold total pages if needed
    const [totalEvents, setTotalEvents] = useState(0); // State to hold total events if needed
    // State to hold selected category  
    const [category, setCategory] = useState('');
    const [events, setEvents] = useState<EventItem[]>([]); // State to hold fetched events

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
    };

    useEffect(() => {
        const getEvents = async () => {
            try {
                // Fetch events from the server or API
                // const response = await eventService.getAllEvents();
                // console.log("Fetched events:", response);
                const response = await eventService.getAllEvents(currentPage)
                setEvents(response.data || []);
                setCurrentPage(response.page)
                setTotalPages(response.totalPages)
                setTotalEvents(response.total)
                console.log("Fetched events:", response);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }
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
                                <Select value={category} onValueChange={handleCategoryChange}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[39px]">
                {events.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <p className="text-gray-500 text-lg font-semibold">No events found.</p>
                    </div>
                ) : (
                    events.map((event, index) => (
                        <div key={index} className="w-full max-w-[362px] mx-auto">
                            <EventDisplay
                                image={event.image}
                                name={event.name}
                                description={event.description}
                                tagline={event.tagline}
                                category={event.category}
                                day={new Date(event.startDate).getDate().toString()}
                                month={new Date(event.startDate).toLocaleString('default', { month: 'long' })}
                                time={new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}