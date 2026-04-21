"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '../services/auth';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import logo from '@/assets/images/logo.png'
import { LoaderCircle } from 'lucide-react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await adminLogin(email, password);
      login(data.accessToken);
      router.push('/admin/dashboard/start-ups');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f5]">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0">
        {/* Glowing lines and shapes */}
        <div className="absolute left-20 top-1/4 h-px w-96 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="absolute right-20 top-1/3 h-px w-80 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
        <div className="absolute bottom-1/4 left-1/4 h-px w-64 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

        {/* Geometric shapes */}
        <div className="absolute left-32 top-32 h-32 w-32 border border-cyan-500/20 rotate-45"></div>
        <div className="absolute right-40 bottom-40 h-40 w-40 border border-blue-500/20 rotate-12"></div>

      </div>

      <div className="mb-4 flex justify-center">
        <div className="relative">
          <Image
            src={logo}
            alt="Logo"
            width={150}
            height={150}
            className="object-cover"
          />
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-2xl border border-gray-100 bg-[#ffffff] p-8 shadow-2xl backdrop-blur-xl md:p-10">
          {/* Logo */}

          {/* Heading */}
          {/* <h1 className="mb-2 text-center font-inter text-2xl font-bold text-[#1f1f1f]">
            Login
          </h1> */}
          <h1 className="mb-4 text-center leading-normal tracking-wide font-inter text-2xl font-semibold text-[#1f1f1f]/90">
            Admin Portal
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-300 bg-gray-100 pl-12 pr-4 font-roboto text-sm text-[#1f1f1f] outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:bg-white"
                required
                placeholder="email address"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-300 bg-gray-100 pl-12 pr-4 font-roboto text-sm text-[#1f1f1f] outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:bg-white"
                required
                placeholder="Password"
                disabled={loading}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 font-roboto text-base font-normal text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin" />
                  Loading...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

