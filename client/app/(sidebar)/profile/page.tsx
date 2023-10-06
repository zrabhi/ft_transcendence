"use client";
import { useContext, useEffect, useState } from "react";
import { baseUrlUsers, getRequest } from "@/app/context/utils/service";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import ProfileCard from "@/components/LoggedUser/Profile/ProfileCard/ProfileCard";
import { AuthContext } from '@/app/context/AuthContext'
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";
import NavMenu from "@/components/LoggedUser/Profile/NavMenu/NavMenu";
import "./style.scss";

export default function Profile() {
  const { getUserData, user } = useContext(AuthContext);
  const [friendList, setFriendList] = useState<any>([]);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const fetchFriendList = async () => {
    const friendList = await getRequest(`${baseUrlUsers}/user/friends`);
    setFriendList(friendList);
  }

  useEffect( () => {
    try {
      fetchFriendList();
      console.log(friendList);
    }
    catch (error) {
      console.error('Error fetching friend list:', error);
    }
  }, []);

  return (
    <div className="profile-page text-white">
      <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className={`profile ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
        <div className="profile-content min-h-screen p-8">
          <HeaderBar data={user} />
          <ProfileCard data={user} />
          <div className="profile-boxes">
            <div className="navbar-boxes">
              <NavMenu />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
