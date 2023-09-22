"use client";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import "./style.scss";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import ProfileCard from "@/components/LoggedUser/Profile/ProfileCard/ProfileCard";
import { AuthContext } from '@/app/context/AuthContext'
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";
import Achievement from "@/interfaces/Achievement";
import UserStatistics from "@/interfaces/UserStatistics";
import AchievementItem from "@/components/LoggedUser/Profile/Achievement/AchievementItem";
import GameData from "@/components/LoggedUser/Profile/GameData/GameData";
import Statistics from "@/components/LoggedUser/Profile/Statistics/Statistics";
import Leaderboard from "@/components/LoggedUser/Profile/Leaderboard/Leaderboard";
import { baseUrlUsers, getRequest } from "@/app/context/utils/service";
import { GameHistory } from "@/interfaces/GameHistory";
import { Friends } from "@/interfaces/Friends";
import { FaUserFriends, FaHistory, FaListOl } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { GiAchievement } from "react-icons/gi";

export default function Profile() {
  const { getUserData, user } = useContext(AuthContext);

  const [activeItem, setActiveItem] = useState<number>(2);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const listItemWidth = 100 / menuItems.length;
    const left = `calc(${listItemWidth * activeItem}% + ${listItemWidth / 2}%)`;
    const indicator = document.querySelector('.indicator') as HTMLElement;
    if (indicator) {
      indicator.style.left = left;
    }
  }, [activeItem]);

  const handleItemClick = (index: number) => {
    setActiveItem(index);
  };

  const menuItems = [
    { icon: <FaUserFriends />, text: 'Friends' },
    { icon: <FaHistory />, text: 'History' },
    { icon: <FaListOl />, text: 'Leaderboard' },
    { icon: <ImStatsBars />, text: 'Statistics' },
    { icon: <GiAchievement />, text: 'Achievements' },
  ];

  return (
    <div className="profile-page text-white">
      <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className={`profile ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
        <div className="profile-content min-h-screen p-8">
          <HeaderBar />
          <ProfileCard data={user} />
          <div className="profile-boxes">
            <div className="navbar-boxes">
              <div className="nav-menu">
                <ul>
                  {menuItems.map((item, index) => (
                    <li className={`list ${activeItem === index ? 'active' : ''}`} key={index} onClick={() => handleItemClick(index)}>
                      <Link href="">
                        <span className="icon">{item.icon}</span>
                        <span className="text">{item.text}</span>
                      </Link>
                    </li>
                  ))}
                  <div className="indicator absolute left-1/2">
                  </div>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
