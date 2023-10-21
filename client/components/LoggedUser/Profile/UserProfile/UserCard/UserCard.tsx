import React, { useContext, useEffect, useState } from "react";
import { FaUserClock, FaUserCheck, FaUserPlus } from "react-icons/fa";

// faUserPlus for not friend
// faUserCheck for friend
// faUserClock for friend request sent

import "./UserCard.scss";
import { AuthContext } from "@/app/context/AuthContext";
import { baseUrlUsers, postRequest, putRequest } from "@/app/context/utils/service";
import { showSnackbar } from "@/app/context/utils/showSnackBar";

export default function UserCard(user: any) {
  const {
    blockedUsers,
    setBlockedUsers,
    friendsList,
    setFriendsList,
    fetchFriendList,
    friendRequestSent,
    setFriendRequestSent,
    userFriendRequests,
    setUserFriendRequests,
  } = useContext(AuthContext);
  user = user.user;

  const [pendingRequests, setPendingRequest] = useState<any>([])
  const [isInFriendList, setIsFriendList] = useState<any>([])
  useEffect(() => {
    let pending: any[] = [];
    let friendList: any[] = []
    friendsList?.map((member: any) => {
      friendList.push(member.username);
    })
    userFriendRequests?.map((member: any) => {
      pending.push(member.username);
    })
    console.log(pending);
    setIsFriendList(friendList)
    setPendingRequest(pending)
  }
  , [userFriendRequests, friendsList])

  const handleUnblock = async () => {
    try {
      const response = await putRequest(
        `${baseUrlUsers}/unblock/${user.username}`,
        ""
      );
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      const update = blockedUsers?.filter((member: any) => {
        return member !== user.username;
      });
      setBlockedUsers(update);
    } catch (err) {
    }
  };

  const handleBlock = async () => {
    try {
      const response = await putRequest(
        `${baseUrlUsers}/block/${user.username}`,
        ""
      );
      if (response?.error && response?.message === "Unauthorized") {
        showSnackbar("Unauthorized", false)
        return ;
      }
      setBlockedUsers([...blockedUsers, user.username]);
    }
    catch (error) {
    }
  };

  const removeFriendHandler = async () => {
    try {
      const response = await putRequest(
        `${baseUrlUsers}/unfriend/${user.username}`,
        ""
      );
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      const updatedFriendsList = friendsList.filter((friend: any) => {
        return friend.username !== user.username;
      });
      setFriendsList(updatedFriendsList);
      showSnackbar("friend revomed successfully", true)
    } catch (error) {

    }
  };

  const cancelRequestHandler = async () => {
    try {
      const response = await putRequest(
        `${baseUrlUsers}/cancelFriendRequest/${user.username}`,
        ""
      );
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      const updatedFriendRequest = friendRequestSent.filter((friend: any) => {
        return friend !== user.username;
      });
      setFriendRequestSent(updatedFriendRequest);
      showSnackbar("friend request cancled successfully", true);
    } catch (error) {
    }
  };

  const addFriendHandler = async () => {
    try {
      console.log(`add friend click`)
      const response = await postRequest(`${baseUrlUsers}/friendRequest/${user.username}`, "");
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      setFriendRequestSent([...friendRequestSent, user.username])
      showSnackbar(response?.message, true);
  } catch (error) {
    }
  };

  const acceptFriendHandler = async () => {
    try {
      const response = await putRequest(`${baseUrlUsers}/acceptFriendRequest/${user.username}`,"");
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      let updateUserFriendRequests = userFriendRequests.filter((member: any) =>{
        return member.username !== user.username;
      })
      setUserFriendRequests(updateUserFriendRequests);
      await fetchFriendList();
      setPendingRequest([]);
    } catch (error) {
    }
  }

  return (
    <div className="user-card w-full relative ">
      <div className="background"></div>
      <div className="avatar">
        <img
          src={
            user && user.avatar && !user.avatar.includes("googleusercontent")
              ? user.avatar
              : "/images/DefaultAvatar.jpg"
          }
          alt="User Avatar"
        />
      </div>
      <div className="user-details">
        <h2>{user && user.username}</h2>
        <div className="user-states font-bold tracking-wider flex flex-col w-full items-center gap-2">
          <div className="state-msg friend-state px-6 py-2 bg-blue-700 rounded-[.4rem] flex gap-4 justify-between items-center cursor-pointer hover:bg-blue-600">
            {isInFriendList.includes(user.username) ? (
              <div className="flex justify-between items-center gap-4" onClick={removeFriendHandler}>
                <span>Friends</span>
                <div className="icon">
                  <FaUserCheck size={22} />
                </div>
              </div>
            ) : friendRequestSent.includes(user.username) ? (
              <div className="flex justify-between items-center gap-4" onClick={cancelRequestHandler} >
                <span>Friend Request Sent</span>
                <div className="icon">
                  <FaUserClock size={22} />
                </div>
              </div>
            ) : pendingRequests.includes(user.username) ? (
              <div className="flex justify-between items-center gap-4" onClick={acceptFriendHandler} >
                <span>Accept</span>
                <div className="icon">
                  <FaUserCheck size={22} />
                </div>
              </div>
            ) 
            : (
              <div className="flex justify-between items-center gap-4" onClick={addFriendHandler}>
                <span>Add Friend</span>
                <div className="icon">
                  <FaUserPlus size={22} />
                </div>
              </div>
            )}
          </div>
          <div className="block-state px-6 py-2 bg-red-700 rounded-[.4rem] flex gap-4 justify-between items-center cursor-pointer hover:bg-red-600">
            <div className="block-btn">
              {blockedUsers.includes(user.username) ? (
                <button className="" onClick={handleUnblock}>
                  Unblock
                </button>
              ) : (
                <button type="button" className="tracking-wider" onClick={handleBlock}>
                  Block
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="stats">
          <div className="stat-item">
            <h4>Total Games</h4>
            <p>{user && user.totalGames}</p>
          </div>
          <div className="stat-item">
            <h4>Wins</h4>
            <p>{user && user.win}</p>
          </div>
          <div className="stat-item">
            <h4>Losses</h4>
            <p>{user && user.loss}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
