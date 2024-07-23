"use client";
import React, { FC } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setData, registerUser } from '@/store/slices/registerSlice';
import { Register } from "@/routers/types";
import { toast } from 'react-toastify';
export interface PageSignUpProps { }

const PageSignUp: FC<PageSignUpProps> = ({ }) => {

  const dispatch = useDispatch<AppDispatch>();

  const { data, status, error } = useSelector((state: RootState) => state.register);

  const { register, handleSubmit, watch, formState: { errors }, clearErrors, reset } = useForm<Register>({
    defaultValues: data
  });

  const onSubmit: SubmitHandler<Register> = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const resultAction = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(resultAction)) {
      debugger
      toast.success(resultAction.payload?.message as string || 'Registration successful!');
      reset();
    }
    else if (registerUser.rejected.match(resultAction)) {
      toast.error(resultAction.payload as string || 'Error registering user');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(setData({ [name]: value }));
    clearErrors(name as keyof Register);
  };


  return (
    <div className={`nc-PageSignUp  `}>
      <div className="container mb-24 lg:mb-32">
        <h2 className="mt-20   flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <h2 className="my-6 flex items-center text-md  text-neutral-900 dark:text-neutral-100 justify-center">
          Welcome Back Please Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                First Name
              </span>
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                className="mt-1"
                {...register('firstName', { required: 'First name is required' })}
                onChange={handleInputChange}
              />
              {errors.firstName && <span className="text-red-600 text-sm" >{errors.firstName.message}</span>}
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Last Name
              </span>
              <Input
                type="text"
                placeholder="Last Name"
                className="mt-1"
                id="lastName"
                {...register('lastName', { required: 'Last name is required' })}
                onChange={handleInputChange}
              />
              {errors.lastName && <span className="text-red-600 text-sm">{errors.lastName.message}</span>}
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address'
                  }
                })}
                onChange={handleInputChange}
              />
              {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input type="password" className="mt-1"
                id="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                onChange={handleInputChange}

              />
              {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Confirm Passowrd
              </span>
              <Input type="password" className="mt-1"
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (value) => value === watch('password') || 'Passwords do not match'
                })}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && <span className="text-red-600 text-sm">{errors.confirmPassword.message}</span>}
            </label>
            <ButtonPrimary type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Loading...' : 'Register'}
            </ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account?
            <Link href="/login" className="font-semibold underline">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
