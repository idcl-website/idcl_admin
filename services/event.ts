import { axiosInstance } from "@/lib/utils";
import { get } from "http";


export const eventService = {

    createEvent: async (data: any) => {
        const response = await axiosInstance.post('/admin/event/create', data)
        return response.data;
    },

    getAllEvents: async (page = 1, limit = 15) => {
        const response = await axiosInstance.get('/admin/events/all', {
            params: {
                page, limit
            }
        })
        return response.data;
    }

}