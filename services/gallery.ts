import { axiosInstance } from "@/lib/utils";

export interface GalleryItem {
    _id: string;
    image: string;
    title: string;
    description?: string;
    slug?: string;
    category?: string;
    createdAt?: string;
}

export const galleryService = {
    getAllImages: async () => {
        // Fallback or production route
        const response = await axiosInstance.get('/api/admin/gallery/all').catch(() => {
            // Check potential endpoint patterns
            return axiosInstance.get('/admin/gallery/all');
        });
        return response.data;
    },

    uploadImage: async (data: { image: string; title: string; description: string; slug: string; category?: string }) => {
        const response = await axiosInstance.post('/api/admin/gallery/create', data).catch(() => {
            return axiosInstance.post('/admin/gallery/create', data);
        });
        return response.data;
    },

    deleteImage: async (id: string) => {
        const response = await axiosInstance.delete(`/api/admin/gallery/delete/${id}`).catch(() => {
            return axiosInstance.delete(`/admin/gallery/delete/${id}`);
        });
        return response.data;
    },
};
