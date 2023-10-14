"use client";
import { useContext, useEffect, useState } from "react";
import { baseUrlUsers, getRequest } from "@/app/context/utils/service";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import ProfileCard from "@/components/LoggedUser/Profile/ProfileCard/ProfileCard";
import { AuthContext } from '@/app/context/AuthContext'
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";
import NavMenu from "@/components/LoggedUser/Profile/NavMenu/NavMenu";
import "./style.scss";
import { showSnackbar } from "@/app/context/utils/showSnackBar";
import Users from "./users";

export default function Profile() {
  const { getUserData, user,setNotif } = useContext(AuthContext);
  const [friendList, setFriendList] = useState<any>([]); // firendlsit will contain array of (username, status, avatar)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [users, setUsers] = useState<[]>([]);
  const fetchFriendList = async () => {
    try{
    const friendList = await getRequest(`${baseUrlUsers}/user/friends`);
    if (friendList.error && friendList.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;

  }
    setFriendList(friendList);
}catch(err)
{

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
        <div className="profile-content min-h-screen p-8">
          <HeaderBar data={user} />
          <Users users={users} userFriends={friendList}/>
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