"use client";
import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import ProfileCard from "@/components/LoggedUser/Profile/ProfileCard/ProfileCard";
import { useCookies } from "react-cookie";
import { baseUrlUsers, getRequest } from "../context/utils/service";
import { useRouter } from "next/navigation";
import { AuthContext } from '@/app/context/AuthContext'

export default function Profile() {
  const { getUserData, user } = useContext(AuthContext);

  
  return (
    <div className="profile-page text-white">
      <SideBar />
      <div className="profile">
        <div className="profile-content">
          <ProfileCard data={user} />
        </div>
      </div>
    </div>
  );
}
