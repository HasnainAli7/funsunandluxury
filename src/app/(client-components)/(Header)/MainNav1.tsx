import React, { FC, useState } from "react";
import Logo from "@/shared/Logo";
import Navigation from "@/shared/Navigation/Navigation";
import SearchDropdown from "./SearchDropdown";
import ButtonPrimary from "@/shared/ButtonPrimary";
import MenuBar from "@/shared/MenuBar";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import HeroSearchForm2MobileFactory from "../(HeroSearchForm2Mobile)/HeroSearchForm2MobileFactory";
import LangDropdown from "./LangDropdown";
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
export interface MainNav1Props {
  className?: string;
}

const MainNav1: FC<MainNav1Props> = ({ className = "" }) => {

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [loading, seloading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      seloading(true);
      await axios.post('/api/logout');
      dispatch(logoutUser());
      seloading(false);
      window.location.href = '/login';

    } catch (error: any) {
      toast.error(error.response.data.message);
      seloading(false);
    } finally {
      seloading(false);
    }
  };

  return (
    <div className={`nc-MainNav1 relative z-10 ${className}`}>
      <div className="px-4 lg:container h-20 relative flex justify-between">
        <div className="hidden md:flex justify-start flex-1 space-x-4 sm:space-x-10">
          <Logo className="w-24 self-center" />
          <Navigation />
        </div>

        <div className="flex lg:hidden flex-[3] max-w-lg !mx-auto md:px-3 ">
          <div className="self-center flex-1">
            <HeroSearchForm2MobileFactory />
          </div>
        </div>

        <div className="hidden md:flex flex-shrink-0 justify-end flex-1 lg:flex-none text-neutral-700 dark:text-neutral-100">
          <div className="hidden xl:flex space-x-0.5">
            <SwitchDarkMode />
            <SearchDropdown className="flex items-center" />
            <div className="px-1" />
            {isAuthenticated ?
              <ButtonPrimary loading={loading} className="self-center" onClick={handleLogout}>
                Log out
              </ButtonPrimary>
              :<ButtonPrimary className="self-center" href="/login">
                Sign up / Login
              </ButtonPrimary>
            }
            {/* <ButtonPrimary className="self-center" href="/">
              Message me
            </ButtonPrimary> */}
            {isAuthenticated &&
              <ButtonPrimary className="self-center" href="/Dashboard">
                Dashboard
              </ButtonPrimary>
            }
          </div>

          <div className="flex xl:hidden items-center">
            <SwitchDarkMode />
            <div className="px-0.5" />
            <MenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav1;
