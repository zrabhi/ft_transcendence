"use client";
import { useContext, useEffect, useState } from "react";
import { baseUrlUsers, getRequest } from "@/app/context/utils/service";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import ProfileCard from "@/components/LoggedUser/Profile/ProfileCard/ProfileCard";
import { AuthContext } from '@/app/context/AuthContext'
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";
import NavMenu from "@/components/LoggedUser/Profile/NavMenu/NavMenu";
import "./style.scss";
import LeaderboardData from "@/components/LoggedUser/Profile/ProfileData/LeaderboardData";
import FriendsData from "@/components/LoggedUser/Profile/ProfileData/FriendsData";

export default function Profile() {
  const { getUserData, user } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number>(2);

  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getRequest(`${baseUrlUsers}/users`);
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchFriends = async () => {
      try {
        const friends = await getRequest(`${baseUrlUsers}/user/friends`);
        setFriends(friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    }

    fetchUsers();
    fetchFriends();

    const debouncedFetchUsers = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => {
      clearTimeout(debouncedFetchUsers);
    };
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
              <NavMenu setSelectedItem={setSelectedItem} />
            </div>
            <div className="data">
              { selectedItem === 0 && <FriendsData friends={friends} /> }
              { selectedItem === 1 && <div>History</div> }
              { selectedItem === 2 && <LeaderboardData users={users} /> }
              { selectedItem === 3 && <div>Statistics</div> }
              { selectedItem === 4 && <div>Achievements</div> }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
