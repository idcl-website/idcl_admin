"use client"
import Image from "next/image"
import Link from "next/link";
import facebook from "@/assets/icons/Facebook.png"
import twiter from "@/assets/icons/Twitter.png"
import instagram from "@/assets/icons/Instagram.png"
import founder from "@/assets/images/founder.png"
import back from "@/assets/icons/back.svg"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { startUpService } from "@/services/startup";
import axios from 'axios';

const founders = [
    {
        image: founder,
        name: 'John Doe',
        position: 'position',
        social: [
            {
                icon: facebook,
                href: '#'
            },
            {
                icon: twiter,
                href: '#'
            },
            {
                icon: instagram,
                href: '#'
            },
        ]
    },

]

const Crises = {
    Access: {
        list: [
            'Over 60% of rural communities in Northern Nigeria lack access to basic healthcare.',
            'Patients travel 1030km to see a doctor, often by foot or motorcycle.',
            'Preventable diseases remain untreated due to distance and cost barriers.'
        ]
    },
    Solution: {
        list: [
            "GPS-tracked mobile clinic vans staffed with nurses and solar-powered diagnostic",
            'Real-time access to doctors via tablet-based telehealth',
            'Local health workers trained for follow-up care'
        ]
    }
}

export default function StartUpProfile() {
    const { id } = useParams();
    const router = useRouter();
    const [startupProfile, setStartupProfile] = useState({
        name: '',
        industry: '',
        date: '',
        logo: '',
        location: '',
        founded: '',
        track: '',
        reach: '',
        region: '',
        size: '',
        funds: '',
        support: '',
        founderstory: ''
    })

    useEffect(() => {
        const startup = async () => {
            try {
                const data = await startUpService.getStartUp(id as string)
                setStartupProfile({
                    name: data.name,
                    industry: data.industry,
                    date: data.date,
                    logo: data.logo,
                    location: data.location,
                    founded: data.date,
                    track: data.track,
                    reach: data.reach,
                    region: data.region,
                    size: data.size,
                    funds: data.funds,
                    support: data.support,
                    founderstory: data.story
                })
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error(error.response?.data?.message || "An error occurred. Retry");
                } else {
                    console.error("An unexpected error occurred");
                }
            }
        }
        startup();
    }, [id])

    return (
        <section className="flex flex-col md:flex-row items-start gap-4 lg:gap-[25px] w-full px-4 sm:px-6 md:px-8">

            {/* Back button and logo container */}
            <div className="flex flex-row md:flex-col items-center md:items-start gap-4 w-full md:w-auto md:sticky md:top-4">
                <button onClick={() => router.back()} className="flex-shrink-0">
                    <Image
                        src={back}
                        alt="Back-Button"
                        width={40}
                        height={40}
                        className="object-cover"
                        priority
                    />
                </button>

                {/* Logo - visible on mobile and md+ screens */}
                <div className="md:hidden w-[70px] h-[70px] bg-white p-2 flex items-center justify-center rounded-full border border-[#005DFF]">
                    <Image
                        src={startupProfile.logo}
                        alt="Startup Logo"
                        width={70}
                        height={70}
                        className="object-contain w-full h-full"
                    />
                </div>
            </div>

            {/* Main content */}
            <main className="flex flex-col items-start gap-4 lg:gap-[26px] w-full lg:w-[643px]">
                {/* Header section */}
                <div className="flex flex-col py-4 lg:py-[20px] px-4 lg:px-[30px] items-start gap-2 lg:gap-[11px] self-stretch rounded-[10px] bg-[#fff] border border-[#E4E4E4] w-full">
                    <h1 className="font-satoshi font-bold text-xl lg:text-[26px] self-stretch text-[#475467] leading-tight lg:leading-[26px] capitalize">{startupProfile.name}</h1>
                    <div className="flex w-[74px] py-1 lg:py-[4px] px-1.5 lg:px-[6px] items-center justify-center gap-2 lg:gap-[10px] bg-[#1E1E1E] rounded-[8px]">
                        <p className="text-[#F5F9FF] font-satoshi font-bold text-xs lg:text-[12px] leading-4 lg:leading-[16px] capitalize">
                            {startupProfile.industry}
                        </p>
                    </div>
                </div>

                {/* Profile details grid */}
                <div className="flex p-4 lg:p-[20px] flex-col items-center justify-center bg-[#fff] gap-2 lg:gap-[6px] self-stretch rounded-[10px] border border-[#E4E4E4]">
                    {[
                        { label: "Stage", value: "Growth" },
                        { label: "Location", value: startupProfile.location },
                        { label: "Date Founded", value: startupProfile.date },
                        { label: "Program Track", value: startupProfile.track },
                        { label: "Audience Reached", value: startupProfile.reach },
                        { label: "Regions Covered", value: startupProfile.region },
                        { label: "Team Size", value: startupProfile.size },
                        { label: "Funding Raised", value: startupProfile.funds },
                        { label: "Support Received", value: startupProfile.support },
                    ].map((item, index) => (
                        <div key={index} className='flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-[9px] self-stretch w-full'>
                            <div className="flex p-2 lg:p-[10px] w-full sm:w-[158px] items-center gap-2 lg:gap-[10px] border border-[#E4E4E4]">
                                <p className="font-satoshi font-bold text-sm lg:text-[16px] leading-5 lg:leading-[21px] text-[#475467]">{item.label}</p>
                            </div>
                            <div className="flex p-2 lg:p-[10px] items-center gap-2 lg:gap-[10px] border border-[#E4E4E4] w-full sm:flex-[1_0_0] bg-gray-50">
                                <p className="font-satoshi font-medium text-sm lg:text-[16px] leading-5 lg:leading-[21px] text-[#475467] capitalize">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Founder story */}
                <div className="bg-white flex p-4 lg:p-[20px] flex-col justify-center items-center gap-4 lg:gap-[16px] self-stretch border border-[#E4E4E4] rounded-[10px]">
                    <h1 className="font-satoshi font-bold text-lg lg:text-[18px] leading-5 lg:leading-[18px] text-[#475467] self-stretch">
                        Founders Story
                    </h1>
                    <p className="font-satoshi font-normal text-base lg:text-[18px] leading-6 lg:leading-[27px] text-[#475467] self-stretch">
                        {startupProfile.founderstory}
                    </p>
                </div>

                {/* Crisis and solution */}
                <div className="bg-white flex p-4 lg:p-[20px] flex-col justify-center items-start gap-4 lg:gap-[16px] self-stretch border border-[#E4E4E4] rounded-[10px]">
                    <h1 className="font-satoshi self-stretch text-[#475467] text-lg lg:text-[18px] font-bold leading-5 lg:leading-[18px]">A Crisis of Access</h1>
                    <ul className="list-disc pl-5 lg:pl-[30px] space-y-2">
                        {Crises['Access'].list.map((item, index) => (
                            <li key={index} className="font-satoshi self-stretch text-[#475467] text-base lg:text-[18px] font-normal leading-6 lg:leading-[27px]">{item}</li>
                        ))}
                    </ul>
                    <h1 className="font-satoshi self-stretch text-[#475467] text-lg lg:text-[18px] font-bold leading-5 lg:leading-[18px]"><p>{`MediBridge's Solution`}</p></h1>
                    <ul className="list-disc pl-5 lg:pl-[30px] space-y-2">
                        {Crises['Solution'].list.map((item, index) => (
                            <li key={index} className="font-satoshi self-stretch text-[#475467] text-base lg:text-[18px] font-normal leading-6 lg:leading-[27px]">{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Founders */}
                <div className="bg-white flex flex-col pt-4 lg:pt-[20px] pr-4 lg:pr-[20px] pb-8 lg:pb-[50px] pl-4 lg:pl-[20px] self-stretch gap-4 lg:gap-[30px] rounded-[10px] border border-[#E4E4E4]">
                    <h1 className="self-stretch text-[#475467] font-satoshi text-lg lg:text-[18px] font-bold leading-5 lg:leading-[18px]">Founders</h1>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-4 lg:gap-[38px]">
                        {founders.map((item, index) => (
                            <div key={index} className="w-full lg:w-[175px] flex items-center flex-col justify-between h-[200px] lg:h-[220px]">
                                <Image
                                    src={item.image}
                                    alt="Founder"
                                    width={88}
                                    height={88}
                                    className="object-cover"
                                    priority
                                />
                                <div className="flex flex-col items-center justify-center">
                                    <p className="font-poppins font-semibold text-base lg:text-[18px] leading-6 lg:leading-[28px] text-[#333F51]">{item.name}</p>
                                    <p className="font-poppins font-medium text-base lg:text-[18px] leading-6 lg:leading-[28px] text-[#005DFF]">{item.position}</p>
                                </div>
                                <div className="w-[104px] flex items-center justify-between">
                                    {item.social.map((item, index) => (
                                        <Link key={index} href={item.href}>
                                            <Image
                                                src={item.icon}
                                                alt="Social Icon"
                                                width={24}
                                                height={24}
                                                className="object-cover"
                                                priority
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Logo - hidden on mobile, visible on md+ screens */}
            <div className="hidden md:flex w-[70px] h-[70px] lg:w-[100px] lg:h-[100px] bg-white p-2 lg:p-4 items-center justify-center rounded-full border border-[#005DFF] sticky top-4">
                <img
                    src={startupProfile.logo}
                    alt="Startup Logo"
                    className="object-contain w-full h-full"
                />
            </div>
        </section>
    )
}