"use client";
import React, { FC, useState, useEffect } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {  registerUser } from '@/store/slices/registerSlice';
import { Register, Role } from "@/routers/types";
import { toast } from 'react-toastify';
import Select from "@/shared/Select";

export interface PageSignUpProps { }

const PageSignUp: FC<PageSignUpProps> = ({ }) => {

  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState<boolean>(false);

  const [Roleerror, setRoleerror] = useState<string | undefined>(undefined);

  const [Roles, setRoles] = useState<Role[]>([]);

  const { data, status, error } = useSelector((state: RootState) => state.register);

  const { control, handleSubmit, watch, formState: { errors }, reset, setValue, clearErrors } = useForm<Register>({
    defaultValues: data as Register
  });

  useEffect(() => {
    const FetchRoles = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/register');
        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        const data = await response.json();
        setRoles(data);
        setRoleerror(undefined);
      } catch (error: any) {
        setRoleerror(error?.message || 'Failed to fetch roles');
      } finally {
        setLoading(false);
      }
    };
    FetchRoles();
  }, []);

  const onSubmit: SubmitHandler<Register> = async (formData) => {

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const form = new FormData();

    (Object.keys(formData) as (keyof Register)[]).forEach(key => {
      if (key === 'Profile' && formData[key]) {
        form.append(key, formData[key] as File); // Append file directly
      } else {
        form.append(key, formData[key] as string); // Append text data
      }
    });

    const resultAction = await dispatch(registerUser(form));

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload?.message as string || 'Registration successful!');
      reset();
    } else if (registerUser.rejected.match(resultAction)) {
      toast.error(resultAction.payload as string || 'Error registering user');
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event as any

    if (files && files[0]) {
      setValue('Profile',files[0]);
    }

    clearErrors("Profile")
  };


  return (
    <div className="nc-PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="mt-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <h2 className="my-6 flex items-center text-md text-neutral-900 dark:text-neutral-100 justify-center">
          Welcome Back Please Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6">

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Registration Type
              </span>
              <Controller
                name="Registration_Type"
                control={control}
                rules={{ required: 'Registration Type is required' }}
                render={({ field }) => (
                  <Select
                    className="mt-1"
                    id="Registration_Type"
                    {...field}
                  >
                    <option value="" disabled selected={true}>
                      Select a Registration Type
                    </option>
                    {Roles.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.role_name}
                      </option>
                    ))}
                  </Select>
                )}
              />
              {errors.Registration_Type && (
                <span className="text-red-600 text-sm">{errors.Registration_Type.message}</span>
              )}
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                First Name
              </span>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    className="mt-1"
                    {...field}
                  />
                )}
              />
              {errors.firstName && <span className="text-red-600 text-sm">{errors.firstName.message}</span>}
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Last Name
              </span>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Last Name"
                    className="mt-1"
                    id="lastName"
                    {...field}
                  />
                )}
              />
              {errors.lastName && <span className="text-red-600 text-sm">{errors.lastName.message}</span>}
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="example@example.com"
                    className="mt-1"
                    id="email"
                    {...field}
                  />
                )}
              />
              {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
            </label>

            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                }}
                render={({ field }) => (
                  <Input
                    type="password"
                    className="mt-1"
                    id="password"
                    {...field}
                  />
                )}
              />
              {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
            </label>

            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Confirm Password
              </span>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'Confirm password is required',
                  validate: (value) => value === watch('password') || 'Passwords do not match'
                }}
                render={({ field }) => (
                  <Input
                    type="password"
                    className="mt-1"
                    id="confirmPassword"
                    {...field}
                  />
                )}
              />
              {errors.confirmPassword && <span className="text-red-600 text-sm">{errors.confirmPassword.message}</span>}
            </label>

            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Description
              </span>
              <Controller
                name="Description"
                control={control}
                render={({ field }) => (
                  <textarea
                    className="mt-1 rounded-2xl text-sm font-normal h-15 px-4 py-3 block w-full border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900"
                    id="Description"
                    {...field}
                  />
                )}
              />
              {errors.Description && <span className="text-red-600 text-sm">{errors.Description.message}</span>}
            </label>

            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Upload Profile
              </span>
              <Controller
                name="Profile"
                control={control}
                rules={{ required: 'Profile image is required' }}
                render={({ field }) => (
                  <Input
                    type="file"
                    className="mt-1"
                    id="Profile"
                    onChange={(e:any) => {
                      field.onChange(e.target.files);
                      handleImageChange(e.target.files);
                    }}
                  />
                )}
              />
              {errors.Profile && <span className="text-red-600 text-sm">{errors.Profile.message}</span>}
            </label>

            <ButtonPrimary type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Loading...' : 'Register'}
            </ButtonPrimary>
          </form>

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
