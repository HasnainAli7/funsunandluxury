"use client";
import React, { FC, useState } from "react";
import facebookSvg from "@/images/Facebook.svg";
import twitterSvg from "@/images/Twitter.svg";
import googleSvg from "@/images/Google.svg";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import axios from 'axios';
import { loginUser } from '@/store/slices/authSlice';
import { toast } from 'react-toastify';
export interface PageLoginProps { }

// const loginSocials = [
//   {
//     name: "Continue with Facebook",
//     href: "#",
//     icon: facebookSvg,
//   },
//   {
//     name: "Continue with Twitter",
//     href: "#",
//     icon: twitterSvg,
//   },
//   {
//     name: "Continue with Google",
//     href: "#",
//     icon: googleSvg,
//   },
// ];

interface LoginFormInputs {
  email: string;
  password: string;
}

const PageLogin: FC<PageLoginProps> = () => {

  const [loading, seloading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { register, handleSubmit, watch, formState: { errors }, clearErrors, reset } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      seloading(true);
      const response = await axios.post('/api/login', data);
      const { token } = response.data;
      dispatch(loginUser(token));
      seloading(false);
      window.location.href = '/';
    } catch (error: any) {
      seloading(false);
      toast.error(error.response.data.message);
    }
    finally {
      seloading(false);
    }
  };

  return (
    <div className={`nc-PageLogin`}>
      <div className="container mb-24 lg:mb-32">
        <h2 className="mt-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <h2 className="my-6 flex items-center text-md text-neutral-900 dark:text-neutral-100 justify-center">
          Welcome Back Please Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* Social Media Login Buttons */}
          {/* <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <Image
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))}
          </div>

          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div> */}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">Email address</span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
                <Link href="/login" className="text-sm underline font-medium">
                  Forgot password?
                </Link>
              </span>
              <Input
                type="password"
                className="mt-1"
                placeholder="Type Your Password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </label>
            <ButtonPrimary loading={loading} type="submit">Login</ButtonPrimary>
          </form>

          {/* Signup Link */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link href="/signup" className="font-semibold underline">
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
