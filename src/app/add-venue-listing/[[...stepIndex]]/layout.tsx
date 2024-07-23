import React from "react";
import { FC } from "react";
import { FormProvider } from "@/app/add-venue-listing/FormContext";
import { Route } from "@/routers/types";
export interface CommonLayoutProps {
  children: React.ReactNode;
}

const CommonLayout: FC<CommonLayoutProps> = ({children}) => {
  return (
         <FormProvider>
          <div className={`nc-PageAddListing1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32`}>
            <div className="space-y-11">
                {children}
            </div>
          </div>
         </FormProvider>
  );
};

export default CommonLayout;
