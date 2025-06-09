"use client"
import Image from "next/image"
import Link from "next/link";
import facebook from "@/assets/icons/Facebook.png"
import twiter from "@/assets/icons/Twitter.png"
import instagram from "@/assets/icons/Instagram.png"
import founder from "@/assets/images/founder.png"
import logo from "@/assets/images/image.png"
import back from "@/assets/icons/back.svg"
import { useRouter } from "next/navigation";
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
const ProfileData = [
    'Stage',
    'Location',
    'Date Founded',
    'Program Track',
    'Patients Reached',
    'Regions Covered',
    'Team Size',
    'Funding Raised',
    'Support Received',
] as const

type ProfileDataKey =
    | 'Stage'
    | 'Location'
    | 'Founded'
    | 'Track'
    | 'Reached'
    | 'Covered'
    | 'Size'
    | 'Raised'
    | 'Received';

interface ProfileData {
    Stage: string;
    Location: string;
    Founded: string;
    Track: string;
    Reached: string;
    Covered: string;
    Size: number;
    Raised: string;
    Received: string;
}

const profileData: ProfileData = {
    Stage: 'Growth',
    Location: 'Imo, Nigeria',
    Founded: 'Founded 2024',
    Track: 'Accelerator Cohort 2',
    Reached: '50,000+',
    Covered: '12 underserved rural areas',
    Size: 18,
    Raised: '$200,000 Seed Round',
    Received: 'Mobile infrastructure, funding, public health mentorship'
}

const Crises = {
    Access: {
        list: [
            'Over 60% of rural communities in Northern Nigeria lack access to basic healthcare.',
            'Patients travel 10–30km to see a doctor, often by foot or motorcycle.',
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
    const router = useRouter()
    const getDataKey = (label: typeof ProfileData[number]): ProfileDataKey => {
        switch (label) {
            case 'Date Founded': return 'Founded';
            case 'Program Track': return 'Track';
            case 'Patients Reached': return 'Reached';
            case 'Regions Covered': return 'Covered';
            case 'Team Size': return 'Size';
            case 'Funding Raised': return 'Raised';
            case 'Support Received': return 'Received';
            default: return label as ProfileDataKey;
        }
    };

    return (
        <section className="flex flex-col md:flex-row items-start gap-4 lg:gap-[25px]">

            <button onClick={() => router.back()} >
                <Image
                    src={back}
                    alt="Back-Button"
                    width={40}
                    height={40}
                    className="object-cover"
                    priority
                />
            </button>

            <main className="flex flex-col items-start gap-4 lg:gap-[26px] w-full lg:w-[643px]">
                <div className="flex flex-col py-4 lg:py-[20px] px-4 lg:px-[30px] items-start gap-2 lg:gap-[11px] self-stretch rounded-[10px] bg-[#fff] border border-[#E4E4E4]">
                    <h1 className="font-satoshi font-bold text-xl lg:text-[26px] self-stretch text-[#475467] leading-tight lg:leading-[26px]">MediBridge</h1>
                    <div className="flex w-[74px] py-1 lg:py-[4px] px-1.5 lg:px-[6px] items-center justify-center gap-2 lg:gap-[10px] bg-[#1E1E1E] rounded-[8px]">
                        <p className="text-[#F5F9FF] font-satoshi font-bold text-xs lg:text-[12px] leading-4 lg:leading-[16px]">
                            HealthTech
                        </p>
                    </div>
                </div>


                <div className="flex p-4 lg:p-[20px] flex-col items-center justify-center bg-[#fff] gap-2 lg:gap-[6px] self-stretch rounded-[10px] border border-[#E4E4E4]">
                    {ProfileData.map((item, index) => {
                        const dataKey = getDataKey(item);
                        return (
                            <div key={index} className='flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-[9px] self-stretch w-full'>
                                <div className="flex p-2 lg:p-[10px] w-full lg:w-[158px] items-center gap-2 lg:gap-[10px] border border-[#E4E4E4]">
                                    <p className="font-satoshi font-bold text-sm lg:text-[16px] leading-5 lg:leading-[21px] text-[#475467]">{item}</p>
                                </div>
                                <div className="flex p-2 lg:p-[10px] items-center gap-2 lg:gap-[10px] border border-[#E4E4E4] w-full lg:flex-[1_0_0]">
                                    <p className="font-satoshi font-medium text-sm lg:text-[16px] leading-5 lg:leading-[21px] text-[#475467]">{profileData[dataKey]}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>


                <div className="bg-white flex p-4 lg:p-[20px] flex-col justify-center items-center gap-4 lg:gap-[16px] self-stretch border border-[#E4E4E4] rounded-[10px]">
                    <h1 className="font-satoshi font-bold text-lg lg:text-[18px] leading-5 lg:leading-[18px] text-[#475467] self-stretch">
                        Founders Story
                    </h1>
                    <p className="font-satoshi font-normal text-base lg:text-[18px] leading-6 lg:leading-[27px] text-[#475467] self-stretch">
                        Dr. Halima Yusuf, a rural health advocate, founded MediBridge after witnessing a woman lose her child due to lack of access to emergency care. With limited hospitals and poor transport infrastructure in rural Nigeria, she envisioned mobile clinics powered by telemedicine and local health agents. MediBridge was born to make healthcare accessible—wherever it's needed most.
                    </p>
                </div>

                <div className="bg-white flex p-4 lg:p-[20px] flex-col justify-center items-start gap-4 lg:gap-[16px] self-stretch border border-[#E4E4E4] rounded-[10px]">
                    <h1 className="font-satoshi self-stretch text-[#475467] text-lg lg:text-[18px] font-bold leading-5 lg:leading-[18px]">A Crisis of Access</h1>
                    <ul className="list-disc pl-5 lg:pl-[30px] space-y-2">
                        {Crises['Access'].list.map((item, index) => (
                            <li key={index} className="font-satoshi self-stretch text-[#475467] text-base lg:text-[18px] font-normal leading-6 lg:leading-[27px]">{item}</li>
                        ))}
                    </ul>
                    <h1 className="font-satoshi self-stretch text-[#475467] text-lg lg:text-[18px] font-bold leading-5 lg:leading-[18px]">MediBridge's Solution:</h1>
                    <ul className="list-disc pl-5 lg:pl-[30px] space-y-2">
                        {Crises['Solution'].list.map((item, index) => (
                            <li key={index} className="font-satoshi self-stretch text-[#475467] text-base lg:text-[18px] font-normal leading-6 lg:leading-[27px]">{item}</li>
                        ))}
                    </ul>
                </div>


                <div className="bg-white flex flex-col pt-4 lg:pt-[20px] pr-4 lg:pr-[20px] pb-8 lg:pb-[50px] pl-4 lg:pl-[20px] self-stretch gap-4 lg:gap-[30px] rounded-[10px] border border-[#E4E4E4]">
                    <h1 className="self-stretch text-[#475467] font-satoshi text-lg lg:text-[18px] font-bold leading-5 lg:leading-[18px]">Founders</h1>
                    <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-4 lg:gap-[38px]">
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
            <div className="">
                <Image
                    src={logo}
                    alt="Startup Logo"
                    width={64}
                    height={64}
                    className="object-cover"
                    priority
                />
            </div>
        </section>
    )
}