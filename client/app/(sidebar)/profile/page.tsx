"use client";
import { useContext, useEffect, useState } from "react";
import { baseUrlUsers, getRequest } from "@/app/context/utils/service";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import ProfileCard from "@/components/LoggedUser/Profile/ProfileCard/ProfileCard";
import { AuthContext } from '@/app/context/AuthContext'
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";
import NavMenu from "@/components/LoggedUser/Profile/NavMenu/NavMenu";
import FriendsData from "@/components/LoggedUser/Profile/ProfileData/FriendsData";
import LeaderboardData from "@/components/LoggedUser/Profile/ProfileData/LeaderboardData";
import "./style.scss";
import { showSnackbar } from "@/app/context/utils/showSnackBar";

import Users from "./users";
import GameHistoryList from "@/components/LoggedUser/Profile/ProfileData/GameHistoryList";

export default function Profile() {
  const { getUserData, user,setNotif } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number>(2);
  const [users, setUsers] = useState<[]>([]);
  const [friendList, setFriendList] = useState<any>([]);
  const [gameList, setGameList] = useState<any>([]);

  const fetchUsers = async () => {
    try {
      console.log("fetching users");
      const allUsers = await getRequest(`${baseUrlUsers}/allUsers`);
      let leaderBoardList = allUsers.sort((user1: any, user2: any) => {
        console.log(`sorting ${user1.username} and ${user2.username}`);
        return user2.win - user1.win;
      })
      setUsers(leaderBoardList.slice(0, 15));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFriendList = async () => {
    try {
      const friendList = await getRequest(`${baseUrlUsers}/user/friends`);
      if (friendList.error && friendList.message === "Unauthorized") {
        showSnackbar("Unauthorized", false)
        return ;
      }
      setFriendList(friendList);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGameHistory = async () => {
    try {
      const gameList = await getRequest(`${baseUrlUsers}/user/matches`);
      if (gameList.error && gameList.message === "Unauthorized") {
        showSnackbar("Unauthorized", false)
        return ;
      }
      setGameList(gameList);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    try {
      (async () =>{
      await fetchFriendList();
      })()
    }
    catch (error) {
      console.error('Error fetching friend list:', error);
    }

    const debouncedFetchData = setTimeout(async () => {
      await fetchUsers();
      await fetchFriendList();
      await fetchGameHistory();
    }, 300);

    return () => {
      clearTimeout(debouncedFetchData);
    };
  }, []);

  useEffect(()=>
  {
    (async () =>{
      try {
        const response = await getRequest(`${baseUrlUsers}/users`);
        if (response?.error)
        {
          if (response.message ==="Unauthorized")
            showSnackbar("Unauthorized", false)
          return ;
        }
        setUsers(response)
      } catch(err) {
        console.error('Error fetching users:', err);
      }
    })()
  },[])
  return (
    <div className="profile-page text-white">
      <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className={`profile ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
        <div className="profile-content min-h-screen p-8">
          <HeaderBar data={user} />
          <Users users={users} userFriends={friendList}/>
          <ProfileCard data={user} />
          <div className="profile-boxes">
            <div className="navbar-boxes">
              <NavMenu setSelectedItem={setSelectedItem} />
            </div>
            <div className="data">
              { selectedItem === 0 && <FriendsData friendList={friendList} /> }
              { selectedItem === 1 && <GameHistoryList gameList={gameList} /> }
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
