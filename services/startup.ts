import { axiosInstance } from "@/lib/utils";
import { startupDto } from "@/app/admin/dashboard/start-ups/add-new-startup/page";


export const startUpService = {

    postStartUp: async (data: startupDto) => {
        const response = await axiosInstance.post('/admin/startup/create', { ...data })
        return response.data;
    },

    getAllStarups: async () => {
        const response = await axiosInstance.get('/admin/startups')
        return response.data;
    },

    updateApprovalStatus: async (id: string) => {
        const response = await axiosInstance.put(`/admin/startups`, { id })
        return response.data;
    },

    getStartUp: async (id: string) => {
        const response = await axiosInstance.get(`/admin/startup/${id}`)
        return response.data;
    }
}