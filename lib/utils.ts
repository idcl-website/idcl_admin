import axios from "axios";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const API_URL = process.env.NEXT_PUBLIC_API_URL

console.log("connection backend",API_URL)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(value);
}