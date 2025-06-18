"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '../../services/auth';
import AppLogo from '@/components/general/logo';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
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
      console.log(data)
      login(data.accessToken);
      router.push('/admin/dashboard/start-ups');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Retry');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative w-full min-h-screen flex flex-col items-start justify-center p-4'>
      <div className="mb-8 md:mb-0 md:absolute md:top-8 md:left-8">
        <AppLogo />
      </div>

      <form
        onSubmit={handleSubmit}
        className={`
          w-full max-w-full md:w-[670px] 
          py-6 md:py-[36px] 
          px-6 md:px-[63px] 
          bg-white rounded-[10px] 
          flex flex-col gap-6 md:gap-[30px] 
          shadow-md
          relative md:absolute 
          md:top-[120px] 
          md:left-1/2 md:transform md:-translate-x-1/2
        `}
      >
        <h1 className="text-[#000] text-[#0A0D13] font-inter text-2xl md:text-[30px] font-semibold leading-[120%] tracking-[-0.6px]">
          Login
        </h1>

        {error && (
          <div className="mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="text-[#344054] text-gray-700 font-figtree text-base md:text-lg font-medium leading-[150%]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black text-sm md:text-base"
            required
            autoFocus
            placeholder='support@gmail.com'
          />
        </div>

        <div className="mb-6">
          <label className="text-[#344054] text-gray-700 font-figtree text-base md:text-lg font-medium leading-[150%]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black text-sm md:text-base"
            required
            placeholder='***********'
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-[56px] font-roboto font-semibold hover:bg-blue-700 transition text-sm md:text-base"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : 'Login'}
        </button>
      </form>
    </div>
  );
}