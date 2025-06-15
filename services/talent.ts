import { axiosInstance } from "@/lib/utils";

interface CreateTalent {
    email: string,
    image: string,
    track: string,
    name: string
}
export const TalentService = {

    createTalent: async (data: CreateTalent) => {
        const response = await axiosInstance.post('/admin/talent/create', data)
        return response.data
    },

    getAllTalents: async () => {
        const response = await axiosInstance.get('/admin/talent/all');
        return response.data;
    }
}