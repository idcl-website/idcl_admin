import { axiosInstance } from "@/lib/utils";

interface CreateAnnouncement {
    message: string;
    isActive?: boolean;
    order?: number;
    link?: string;
}

export const announcementService = {

    createAnnouncement: async (data: CreateAnnouncement) => {
        const response = await axiosInstance.post('/admin/announcement/create', data)
        return response.data;
    },

    getAllAnnouncements: async (page = 1, limit = 15) => {
        const response = await axiosInstance.get('/admin/announcements/all', {
            params: {
                page, limit
            }
        })
        return response.data;
    },

    updateAnnouncement: async (id: string, data: CreateAnnouncement) => {
        const response = await axiosInstance.patch(`/admin/announcement/update/${id}`, data)
        return response.data;
    },

    deleteAnnouncement: async (id: string) => {
        const response = await axiosInstance.delete(`/admin/announcement/delete/${id}`)
        return response.data;
    },

    toggleAnnouncement: async (id: string) => {
        const response = await axiosInstance.put(`/admin/announcement/toggle/${id}`)
        return response.data;
    }

}
