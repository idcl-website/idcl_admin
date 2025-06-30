import Image from "next/image"

type EventItem = {
    image: string;
    name: string;
    description: string;
    tagline: string;
    category: string;
    day: string;
    month: string;
    time: string;
};

export default function EventDisplay({ image, name, description, tagline, day, month, time }: EventItem) {
    return (
        <div className="w-full max-w-[362px] h-[430px] mx-auto flex flex-col items-center bg-white rounded-[18px] shadow border border-[#E1ECFF] overflow-hidden">
            {/* Image Container */}
            <div className="w-full aspect-[362/197] min-h-[197px] relative">
                <Image
                    src={image}
                    alt="event image"
                    fill
                    className="object-cover rounded-t-[18px]"
                    priority
                    sizes="(max-width: 362px) 100vw, 362px"
                />
            </div>

            {/* Content Container */}
            <div className="flex-1 w-full py-4 px-5 sm:py-5 sm:px-6 rounded-b-[18px] flex flex-col gap-3 justify-between">
                {/* Header Section */}
                <div className="flex flex-col gap-2 flex-1">
                    <h1 className="text-black font-satoshi text-lg sm:text-xl font-bold leading-6 sm:leading-7 truncate">
                        {name}
                    </h1>

                    <div className="bg-black w-fit px-3 py-1 rounded-[15px] border border-[rgba(0,0,0,0.23)]">
                        <p className="font-satoshi text-white text-xs sm:text-sm font-bold leading-5 truncate">
                            {tagline}
                        </p>
                    </div>

                    <p className="font-satoshi text-xs sm:text-sm font-normal leading-5 text-[#6A6A6A] line-clamp-2 min-h-[40px]">
                        {description}
                    </p>
                </div>

                {/* Date/Time Section */}
                <div className="flex justify-between items-end w-full mt-2">
                    <div className="flex items-end gap-1 sm:gap-2">
                        <p className="font-satoshi font-bold text-2xl sm:text-3xl text-black leading-none">
                            {day}
                        </p>
                        <p className="font-satoshi font-bold text-base sm:text-lg text-blue-600 leading-none">
                            {month}
                        </p>
                    </div>
                    <p className="font-satoshi font-bold text-xs sm:text-sm text-[#7C7C7C] whitespace-nowrap">
                        {time}
                    </p>
                </div>
            </div>
        </div>
    )
}