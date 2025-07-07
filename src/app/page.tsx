"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAPI } from '@/services/authAPI';
import { LoginRequestBody } from '@/types/userTypes';

const Page = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginRequestBody>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validated: boolean = validateForm();
    if (!validated) {
      alert('Fill the form completely');
      return;
    }

    try {
      const result = await loginAPI(formData);
      console.log(result);
      
      if(result.success){
        alert('Login success');
        sessionStorage.setItem('tk', JSON.stringify(result?.token));
        sessionStorage.setItem('rl', JSON.stringify(result?.data));
        sessionStorage.setItem('user', JSON.stringify(result?.user));
        router.push('/dashboard');
      }else{
        alert(result.error || 'Login failed')
      }
    } catch (err) {
      alert('Something went wrong');
      console.log(err);
    }
  };
  
  return (
    <div className="h-screen bg-gray-100 text-black flex items-center justify-center font-sans">
      <div className="flex rounded-2xl p-8 bg-white shadow-lg max-w-4xl w-full">
        <div className="w-1/2 flex items-center justify-center">
          <Image
            width={550}
            height={500}
            src="/login-img.jpg"
            alt="login image"
            className="object-contain"
            priority
          />
        </div>

        <div className="w-1/2 flex flex-col justify-center px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back user!</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in with your email to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                  }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-1/2 bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-500 transition"
            >
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page