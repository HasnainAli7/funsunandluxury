import React, { FC } from "react";
import { useFormState } from "@/app/add-venue-listing/FormContext";
import { useForm, SubmitHandler } from "react-hook-form";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { submitVenue } from '@/store/slices/venueSlice';
import { VenueSpace } from "@/routers/types"
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { toast } from 'react-toastify';
export interface PageAddListing7Props { }

const PageAddListing6: FC<PageAddListing7Props> = () => {

  const dispatch = useDispatch<AppDispatch>();

  const { venues, status } = useSelector((state: RootState) => state.venue);

  const user = useSelector((state: RootState) => state.auth.user);

  const { onHandleNext, setFormData, onHandleBack, formData, step } = useFormState();
  const { register, handleSubmit, formState: { errors }, setValue, clearErrors, reset } = useForm<VenueSpace>({
    defaultValues: formData,
  });

  const onHandleFormSubmit: SubmitHandler<VenueSpace> = async (data) => {

    formData.createdBy = Number(user?.id);

    setFormData((prev: any) => ({ ...prev, ...data }));

    setValue("createdBy",Number(user?.id));

    const formdata = new FormData();


    // Append all form fields
    Object.keys(data).forEach((key) => {
      const typedKey = key as keyof VenueSpace; // Type assertion to keyof VenueSpace

      if (typedKey === 'venueimage' && Array.isArray(data[typedKey])) {
        // Handle multiple files (if venueimage is an array of files)
        (data[typedKey] as File[]).forEach((file) => {
          formdata.append('venueimage', file);
        });
      } else if (typedKey === 'Venue_cover_image' && data[typedKey] instanceof File) {
        // Handle single file (if Venue_cover_image is a single file)
        formdata.append('Venue_cover_image', data[typedKey]);
      }
      else {
        // Handle other form fields
        formdata.append(typedKey, data[typedKey] as string | Blob); // Adjust type as needed
      }
    });


    const resultAction = await dispatch(submitVenue(formData));

    if (submitVenue.fulfilled.match(resultAction)) {

      toast.success(resultAction.payload?.message);
      reset();
    }
    else if (submitVenue.rejected.match(resultAction)) {

      toast.error(resultAction.payload as string);
    }

  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    setFormData((prev: any) => ({ ...prev, venueimage: files }));
  };

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFormData((prev: any) => ({ ...prev, Venue_cover_image: files[0] }));
    }
  };


  return (
    <form onSubmit={handleSubmit(onHandleFormSubmit)} className="listingSection__wrap">

      <div className="space-y-11">
        <div>
          <span className="text-4xl font-semibold">{step}</span>{" "}
          <span className="text-lg text-neutral-500 dark:text-neutral-400">
            / 6
          </span>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold">Upload photos of your space:</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Making a Great First Impression with Your Listing Photos are the first things that guests will notice, so it's essential to make them count.
        </span>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        <div>
          <span className="text-lg font-semibold">Cover image</span>
          <div className="mt-5 ">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-neutral-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>

                <div className="font-[sans-serif] max-w-md mx-auto">
                  <input type="file"
                    onChange={handleCoverImageChange}
                    className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 10MB.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ----------------- */}
        <div>
          <span className="text-lg font-semibold">Pictures of the place</span>
          <div className="mt-5 ">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-neutral-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>

                <div className="font-[sans-serif] max-w-md mx-auto">
                  <input type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 10MB.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-5">
        <ButtonSecondary onClick={onHandleBack}>Go back</ButtonSecondary>
        <ButtonPrimary disabled={status === 'loading'}>
          {status === 'loading' ? 'Loading...' : 'Submit'}</ButtonPrimary>
      </div>
    </form>
  );
};

export default PageAddListing6;
