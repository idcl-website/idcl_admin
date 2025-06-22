import { axiosInstance } from "@/lib/utils";

interface CreateBlog {
    title: string,
    image: string,
    snippet: string,
    body: string
}


export const blogService = {

    createBlog: async (data: CreateBlog) => {
        const response = await axiosInstance.post('/admin/blog/create', data)
        return response.data;
    },

}