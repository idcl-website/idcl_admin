import { axiosInstance } from "@/lib/utils";

export async function adminLogin(email: string, password: string) {
    try {
        const res = await axiosInstance.post('/auth/admin-login', { email, password });
        return res.data;
    } catch (error: any) {
        // Try to extract a useful error message
        const message = error.response?.data?.message || error.message || 'Login failed';
        throw new Error(message);
    }
} 