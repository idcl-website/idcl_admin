import { axiosInstance } from "@/lib/utils";

interface CreateTalent {
    email: string,
    image: string,
    track: string,
    name: string
}
export const TalentService = {

    createTalent: async (data: CreateTalent) => {
        console.log(data)
    }
}