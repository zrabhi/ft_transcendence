"use client";
import { useContext } from "react";
import "./style.scss";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import ProfileCard from "@/components/LoggedUser/Profile/ProfileCard/ProfileCard";
import { AuthContext } from '@/app/context/AuthContext'
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";

export default function Profile() {
  const { getUserData, user } = useContext(AuthContext);

  
  return (
    <div className="profile-page text-white">
      <SideBar />
      <div className="profile">
        <div className="profile-content">
          <HeaderBar />
          <ProfileCard data={user} />
          <div className="profile-boxes">
            <div className="box recent-activities">
              <h4>
                recent activities
              </h4>
            </div>
            <div className="box achievements">
              <h4>
                achievements
              </h4>
            </div>
            <div className="box statistics">
              <h4>
                statistics
              </h4>
            </div>
            <div className="box games-history">
              <h4>
                games history
              </h4>
            </div>
            <div className="box friends">
              <h4>
                friends
              </h4>
            </div>
            <div className="box leaderboard">
              <h4>
                leaderboard
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
