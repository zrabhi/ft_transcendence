"use client";
import "./SideBar.scss";
import Logo from "@/components/MainPage/Logo/Logo";
import { useState, Dispatch, SetStateAction, useContext, useEffect } from "react";
import { CgHomeAlt, CgProfile, CgGames } from "react-icons/cg";
import { PiTelevisionFill, PiChatsFill } from "react-icons/pi";
import { IoMdSettings, IoMdExit } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import Link from 'next/link'
import { baseUrlUsers, putRequest } from "@/app/context/utils/service";
import { BsCaretRightFill, BsCaretLeftFill } from "react-icons/bs";
import { AuthContext } from "@/app/context/AuthContext";

interface SideBarProps {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>; // Use Dispatch and SetStateAction
}

export default function SideBar({ isExpanded, setIsExpanded }: SideBarProps) {
  const router = useRouter();
  const [cookie, setCookie, remove] = useCookies(['access_token']);
  const{ noitfSocket}  = useContext(AuthContext);
  // const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSignOut = () => {
    noitfSocket?.emit("logout")
    remove('access_token');
    router.push("/login");
  };

  return (
    <div className={`sidebar ${isExpanded? '' : '-translate-x-full'} `}>
      <div className="logo h-1/3 w-full ">
        {/* <Logo /> */}
      </div>
      <div className="sidebar-nav h-1/3 ">
        <div className="to-home">
          <Link href='/home'>
            <CgHomeAlt size={24} className="icon" />
          </Link>
        </div>
        <div className="to-profile">
          <Link href='/profile'>
            <CgProfile size={24} className="icon" />
          </Link>
        </div>
        <div className="to-chat">
          <Link href='/chat'>
            <PiChatsFill size={24} className="icon" />
          </Link>
        </div>
        <div className="to-game">
          <Link href='/game'>
            <CgGames size={24} className="icon" />
          </Link>
        </div>
      </div>
      <div className="sidebar-footer h-1/3 ">
        <div className="to-settings">
          <Link href="profile/settings">
            <IoMdSettings size={24} className="icon" />
          </Link>
        </div>
        <div className="to-signout" onClick={handleSignOut}>
          <IoMdExit size={24} className="icon" />
        </div>
      </div>
      <div className="expander cursor-pointer">
        <div className={`icon ${isExpanded? 'collapsed': ''}`} onClick={(e) => setIsExpanded(!isExpanded)} >
          <BsCaretRightFill size={24} />
        </div>
      </div>
    </div>
  );
}
