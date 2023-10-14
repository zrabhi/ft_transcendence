"use client";
import { useContext, useEffect, useState } from "react";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import ProfileCard from "@/components/LoggedUser/Profile/ProfileCard/ProfileCard";
import { AuthContext } from '@/app/context/AuthContext'
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";
import NavMenu from "@/components/LoggedUser/Profile/NavMenu/NavMenu";
import UserProfile from "@/components/LoggedUser/Profile/UserProfile/UserProfile";
import { baseUrlUsers, getRequest } from "@/app/context/utils/service";

export default function Page({params}: {params: {username: string} }) {
  const { username } = params;
  const { getUserData, user } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [users, setUsers] = useState<[]>([]);
  return (
    <div className="profile-page text-white">
      <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className={`profile ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
        <div className="profile-content min-h-screen p-8">
          <HeaderBar data={user} />
          <UserProfile username={username} />
          <NavMenu />
        </div>
      </div>
    </div>
  );
}
