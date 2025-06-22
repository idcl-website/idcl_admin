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

    getAllBlogs: async (page = 1, limit = 15) => {
        const response = await axiosInstance.get('/admin/blogs/all', {
            params: {
                page, limit
            }
        })
        return response.data;
    },

    deleteBlog: async (id: string) => {
        console.log(id)
        const response = await axiosInstance.delete(`/admin/blog/delete/${id}`)
        return response.data;
    }

}