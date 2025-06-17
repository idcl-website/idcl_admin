import { startUpService } from "@/services/startup";
import Image from "next/image"
import Link from "next/link"
import { toast } from 'sonner'

interface StartUpInterface {
    id: string,
    track: string,
    reach: string,
    logo: string,
    date: string,
    name: string,
    story: string,
    type: string,
    isApproved: boolean,
    industry: string,
    region: string,
}

interface ExploreStartUpProps extends StartUpInterface {
    setStartups: React.Dispatch<React.SetStateAction<StartUpInterface[]>>;
}


export default function ExploreStartUp({ id, track, isApproved, reach, story, logo, date, industry, region, name, setStartups }: ExploreStartUpProps) {
    const updateApproval = async (id: string) => {
        try {
            await startUpService.updateApprovalStatus(id)
            setStartups((prev) => prev.map(startup => startup.id === id ? { ...startup, isApproved: !startup.isApproved } : startup))
            toast.success(isApproved ? 'Startup denied approval' : 'Start Approved')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occured. Try again')
        }
    }

    return (
        <div className="relative border border-[#E4E4E4] rounded-lg lg:rounded-[12px] bg-white w-full pt-6 lg:pt-[27px] px-4 lg:px-[20px] pb-4 lg:pb-[14px] flex flex-col items-start gap-3 lg:gap-[18px]">
            {/* Approval Button */}
            <button
                onClick={() => updateApproval(id)}
                className="absolute right-4 lg:right-[20px] top-4 lg:top-[20px] cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 29 28" fill={isApproved ? '#005DFF' : 'none'}>
                    <path d="M17.9014 10.1748L18.0186 10.4521L18.3193 10.4785L27.209 11.25L20.4814 17.083L20.2539 17.2803L20.3223 17.5732L22.3281 26.2451L14.7051 21.6465L14.4473 21.4912L14.1895 21.6465L6.56543 26.2451L8.57227 17.5732L8.64062 17.2803L8.41309 17.083L1.68457 11.25L10.5752 10.4785L10.876 10.4521L10.9932 10.1748L14.4473 2.00098L17.9014 10.1748Z"
                        stroke={isApproved ? 'none' : 'black'}
                        strokeWidth="1.5" />
                </svg>
            </button>

            {/* Logo and Name */}
            <div className="flex items-center gap-3 lg:gap-[11px] w-full">
                <div className="rounded-full border w-12 h-12 lg:w-[70px] lg:h-[70px] border-[#005DFF] p-2 lg:p-4">
                    <img
                        src={logo}
                        alt="Startup-logo"
                        className="object-cover w-full h-full"
                    />
                </div>
                <p className="font-satoshi font-bold text-sm lg:text-[18px] leading-tight lg:leading-[21px] text-[#475467] capitalize line-clamp-1">
                    {name}
                </p>
            </div>

            {/* Industry Badge */}
            <div className="flex w-[74px] py-1 lg:py-[4px] px-1.5 lg:px-[6px] items-center justify-center gap-2 lg:gap-[10px] bg-[#1E1E1E] rounded-md lg:rounded-[8px]">
                <p className="text-[#F5F9FF] font-satoshi font-bold text-xs lg:text-[12px] leading-tight lg:leading-[16px] capitalize line-clamp-1">
                    {industry}
                </p>
            </div>

            {/* Story */}
            <p className="font-satoshi text-sm lg:text-[14px] font-medium leading-normal lg:leading-[18px] text-[#475467] w-full line-clamp-2 lg:line-clamp-3">
                {story}
            </p>

            {/* Case Study */}
            <div className="flex p-2 lg:p-[10px] items-center justify-center gap-2 lg:gap-[10px] w-full bg-[#F9F9F9]">
                <p className="text-[#475467] font-satoshi text-sm lg:text-[14px] font-medium leading-normal lg:leading-[18px] line-clamp-2">
                    {`Case study on how ${name} has served ${reach} patients across ${region}`}
                </p>
            </div>

            {/* View Profile Button */}
            <Link
                href={`/admin/dashboard/start-ups/${id}`}
                className="flex py-2 lg:py-[12px] px-4 lg:px-[33px] w-full lg:w-[159px] items-center justify-center gap-2 lg:gap-[10px] rounded-full lg:rounded-[56px] border border-[#005DFF] hover:bg-[#005DFF]/10 transition-colors duration-200"
            >
                <p className="text-[#005DFF] text-center font-roboto text-sm lg:text-[15px] font-medium leading-normal">
                    View Profile
                </p>
            </Link>
        </div>
    )
}