"use client";
import React from "react";
import "./SideBar.scss";
import Logo from "@/components/MainPage/Logo/Logo";
import { CgHomeAlt, CgProfile, CgGames } from "react-icons/cg";
import { PiTelevisionFill, PiChatsFill } from "react-icons/pi";
import { IoMdSettings, IoMdExit } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import Link from 'next/link'

export default function SideBar() {
  const router = useRouter();
  const [cookie, setCookie, remove] = useCookies(['access_token']);

  // Login out (updated by zac)
  const handleSignOut = () => {
    remove('access_token');
    router.replace("/login");
  };
  return (
    <div className="sidebar">
      <Logo />
      <div className="sidebar-nav">
        <div className="to-home">
          <Link href='home'>
            <CgHomeAlt size={24} className="icon" />
          </Link>
        </div>
        <div className="to-profile">
          <Link href='profile'>
            <CgProfile size={24} className="icon" />
          </Link>
        </div>
        <div className="to-chat">
          <Link href='chat'>
            <PiChatsFill size={24} className="icon" />
          </Link>
        </div>
        {/* <div className="to-live">
          <PiTelevisionFill size={24} className="icon" />
        </div> */}
        <div className="to-game">
          <Link href='game'>
            <CgGames size={24} className="icon" />
          </Link>
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="to-settings">
          <Link href="profile/settings">
            <IoMdSettings size={24} className="icon" />
          </Link>
        </div>
        <div className="to-signout" onClick={handleSignOut}>
          <IoMdExit size={24} className="icon" />
        </div>
      </div>
    </div>
  );
}
