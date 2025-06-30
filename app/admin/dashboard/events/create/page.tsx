"use client";
import { useState } from "react";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { uploadToCloudinary } from "@/HelperFunctions/uploadToCloudinary";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button as CustomButton } from "@/components/ui/button";
import { eventService } from "@/services/event";

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
    "Other",
];

const eventSchema = yup.object().shape({
    image: yup.string().required("Image is required"),
    name: yup.string().required("Event name is required").max(100, "Name too long"),
    tagline: yup.string().required("Tagline is required").max(100, "Tagline too long"),
    description: yup.string().required("Description is required").min(10, "Description too short"),
    category: yup.string().oneOf(eventCategories, "Select a valid category").required("Category is required"),
    startDate: yup.date().required("Start date is required"),
    endDate: yup.date().required("End date is required").min(
        yup.ref('startDate'),
        "End date can't be before start date"
    ),
    time: yup.string().required("Event time is required"),
});

export default function CreateEvent() {
    const router = useRouter();
    const [form, setForm] = useState({
        image: "",
        name: "",
        tagline: "",
        description: "",
        category: "",
        startDate: null as Date | null,
        endDate: null as Date | null,
        time: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await eventSchema.validate(form, { abortEarly: false });
            setErrors({});
            const data = await eventService.createEvent(form);
            router.push("/admin/dashboard/events"); // Redirect to events page after successful creation
            console.log("Event created successfully:", data);
            toast.success("Event created!");
            // Submit logic here
            setForm({
                image: "",
                name: "",
                tagline: "",
                description: "",
                category: "",
                startDate: null,
                endDate: null,
                time: "",
            });
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors: { [key: string]: string } = {};
                err.inner.forEach((e) => {
                    if (e.path) newErrors[e.path] = e.message;
                });
                setErrors(newErrors);
                toast.error("Please fix the errors.");
            }
        }
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow border border-[#E1ECFF]">
            <h1 className="text-xl font-bold mb-4">Create Event</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Image</label>
                    <FileUploader
                        accept="image/*"
                        maxSize={2 * 1024 * 1024}
                        onDrop={async (files) => {
                            const file = files[0];
                            if (!file) return;
                            if (file.size > 2 * 1024 * 1024) {
                                toast.error("File size exceeds 2MB limit");
                                return;
                            }
                            setIsUploading(true);
                            try {
                                const eventImageUrl = await uploadToCloudinary(file);
                                if (typeof eventImageUrl === "string" && eventImageUrl) {
                                    handleChange("image", eventImageUrl); // Set the image URL to form data
                                    toast.success("Image uploaded");
                                } else {
                                    toast.error("Image upload failed");
                                }
                            } catch (error) {
                                toast.error("Image upload failed");
                            }
                            setIsUploading(false);
                        }}
                    />
                    {form.image && (
                        <div className="mt-2 flex flex-col items-start gap-2">
                            <span className="text-xs text-gray-500">Preview:</span>
                            {isUploading ? (
                                <div className="w-40 h-40 flex items-center justify-center rounded-lg border bg-gray-50">
                                    <svg
                                        className="animate-spin h-10 w-10 text-[#144DAF]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                </div>
                            ) : (
                                <img
                                    src={form.image}
                                    alt="Event"
                                    className="w-40 h-40 object-cover rounded-lg border"
                                />
                            )}
                        </div>
                    )}
                    {errors.image && (
                        <p className="text-red-500 text-sm">{errors.image}</p>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <Input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter event name"
                        className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium">Tagline</label>
                    <Input
                        type="text"
                        value={form.tagline}
                        onChange={(e) => handleChange("tagline", e.target.value)}
                        placeholder="Enter event tagline"
                        className={errors.tagline ? "border-red-500" : ""}
                    />
                    {errors.tagline && (
                        <p className="text-red-500 text-sm">{errors.tagline}</p>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <Textarea
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Enter event description"
                        className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description}</p>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <Select
                        value={form.category}
                        onValueChange={(value) => handleChange("category", value)}
                    >
                        <SelectTrigger
                            className={`w-full h-[40px] rounded-lg bg-white border ${errors.category ? "border-red-500" : "border-gray-300"
                                } focus:ring-0 focus:ring-offset-0`}
                        >
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="w-[340px] rounded-xl border border-[#D0D5DD] bg-[#E1ECFF]">
                            {eventCategories.map((option, idx) => (
                                <SelectItem
                                    key={idx}
                                    value={option}
                                    className="font-inter font-medium text-sm focus:bg-[#D0D5DD]"
                                >
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && (
                        <p className="text-red-500 text-sm">{errors.category}</p>
                    )}
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Start Date */}
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Start Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${!form.startDate ? "text-muted-foreground" : ""}`}
                                    type="button"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.startDate ? format(form.startDate, "PPP") : "Pick a start date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={form.startDate || undefined}
                                    onSelect={(date) => handleChange("startDate", date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.startDate && (
                            <p className="text-red-500 text-sm">{errors.startDate}</p>
                        )}
                    </div>
                    {/* End Date */}
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">End Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${!form.endDate ? "text-muted-foreground" : ""}`}
                                    type="button"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.endDate ? format(form.endDate, "PPP") : "Pick an end date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={form.endDate || undefined}
                                    onSelect={(date) => handleChange("endDate", date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.endDate && (
                            <p className="text-red-500 text-sm">{errors.endDate}</p>
                        )}
                    </div>
                </div>
                {/* Time */}
                <div>
                    <label className="block mb-1 font-medium">Time</label>
                    <div className="relative">
                        <Input
                            type="time"
                            value={form.time}
                            onChange={(e) => handleChange("time", e.target.value)}
                            className={errors.time ? "border-red-500" : ""}
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {errors.time && (
                        <p className="text-red-500 text-sm">{errors.time}</p>
                    )}
                </div>
                <Button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="w-full rounded-lg bg-[#144DAF] text-white hover:bg-[#113e8a] transition-colors"
                >
                    {isSubmitting ? "Submitting..." : "Create Event"}
                </Button>
            </form>
        </div>
    );
}