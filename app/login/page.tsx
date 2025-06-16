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
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative w-full h-screen'>
      <AppLogo />
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[670px] py-[36px] px-[63px] bg-white rounded-[10px] flex flex-col mx-auto gap-[30px] shadow-md absolute top-[120px] left-[385px]"
      >
        <h1 className="text-[#000] text-[#0A0D13] font-inter text-[30px] font-semibold leading-[120%] tracking-[-0.6px]">Login</h1>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <div className="mb-4">
          <label className="text-[#344054] text-gray-700 font-figtree text-lg font-medium leading-[150%]">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black"
            required
            autoFocus
            placeholder='support@gmail.com'
          />
        </div>
        <div className="mb-6">
          <label className="text-[#344054] text-gray-700 font-figtree text-lg font-medium leading-[150%">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black"
            required
            placeholder='***********'
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-[56px] font-roboto font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
} 