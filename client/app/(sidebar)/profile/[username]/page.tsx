"use client";
import { useContext, useEffect, useState } from "react";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import ProfileCard from "@/components/LoggedUser/Profile/ProfileCard/ProfileCard";
import { AuthContext } from '@/app/context/AuthContext'
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";
import NavMenu from "@/components/LoggedUser/Profile/NavMenu/NavMenu";
import UserProfile from "@/components/LoggedUser/Profile/UserProfile/UserProfile";
import FriendsData from "@/components/LoggedUser/Profile/ProfileData/FriendsData";
import LeaderboardData from "@/components/LoggedUser/Profile/ProfileData/LeaderboardData";
import { baseUrlUsers, getRequest } from "@/app/context/utils/service";
import { showSnackbar } from "@/app/context/utils/showSnackBar";

export default function Page({params}: {params: {username: string} }) {
  const { username } = params;
  const { getUserData, user } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [users, setUsers] = useState<[]>([]);
  const [selectedItem, setSelectedItem] = useState<number>(2);
  const [friendList, setFriendList] = useState<any>([]); // firendlsit will contain array of (username, status, avatar)

  const fetchUsers = async () => {
    try {
      const allUsers = await getRequest(`${baseUrlUsers}/users`);
      console.log(`length of all users: ${allUsers.length}`);
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFriendList = async () => {
    try {
      const friendList = await getRequest(`${baseUrlUsers}/user/friends/${username}`);
      if (friendList.error && friendList.message === "Unauthorized") {
        showSnackbar("Unauthorized", false)
        return ;
      }
      setFriendList(friendList);
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

    const debouncedFetchUsers = setTimeout(() => {
      fetchUsers();
      fetchFriendList();
    }, 300);

    return () => {
      clearTimeout(debouncedFetchUsers);
    };
  }, []);

  useEffect(()=>
  {
    (async () =>{
      try{
          const response = await getRequest(`${baseUrlUsers}/users`);
          if (response?.error)
          {
            if (response.message ==="Unauthorized")
              showSnackbar("Unauthorized", false)
            return ;
          }
          setUsers(response)
      }catch(err)
      {

      }
    })()
  },[])

  return (
    <div className="profile-page text-white">
      <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className={`profile ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
        <div className="profile-content p-8">
          <HeaderBar data={user} />
          <UserProfile username={username} />
          <NavMenu setSelectedItem={setSelectedItem} />
          <div className="user-data">
            { selectedItem === 0 && <FriendsData friendList={friendList} /> }
              { selectedItem === 1 && <div>History</div> }
              { selectedItem === 2 && <LeaderboardData users={users} /> }
              { selectedItem === 3 && <div>Statistics</div> }
              { selectedItem === 4 && <div>Achievements</div> }
          </div>
        </div>
      </div>
    </div>
  );
}
