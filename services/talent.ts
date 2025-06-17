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

    getAllTalents: async (page = 1, limit = 15) => {
        const response = await axiosInstance.get('/admin/talent/all', {
            params: {
                page, limit
            }
        });
        return response.data;
    },

    getTalent: async (id: string) => {
        const response = await axiosInstance.get(`/admin/talent/${id}`)
        return response.data;
    },

    toggleTalentStatus: async (id: string) => {
        const response = await axiosInstance.put('/admin/talent/toggle', { id })
        return response.data;
    }
}