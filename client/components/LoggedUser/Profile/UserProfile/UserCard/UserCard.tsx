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
    console.log("++++++",friendsList);
    friendsList?.map((member: any) => {
      console.log("----", member.username);
      friendList.push(member.username);
    })
    userFriendRequests?.map((member: any) => {
      console.log("----", member.username);
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
      const update = blockedUsers?.filter((member: any) => {
        return member !== user.username;
      });
      setBlockedUsers(update);
    } catch (err) {
      showSnackbar("error while unblocking user (in cathc)", false);
    }
  };

  const handleBlock = async () => {
    try {
      const response = await putRequest(
        `${baseUrlUsers}/block/${user.username}`,
        ""
      );
      setBlockedUsers([...blockedUsers, user.username]);
    } catch (error) {
      showSnackbar("error while blocking process!", false);
    }
  };

  const removeFriendHandler = async () => {
    try {
      const response = await putRequest(
        `${baseUrlUsers}/unfriend/${user.username}`,
        ""
      );
      const updatedFriendsList = friendsList.filter((friend: any) => {
        return friend.username !== user.username;
      });
      setFriendsList(updatedFriendsList);
      showSnackbar("friend revomed successfully", true)
    } catch (error) {
      console.log(error);

      // showSnackbar("error while unfriend process!", false);
    }
  };

  const cancelRequestHandler = async () => {
    try {
      const response = await putRequest(
        `${baseUrlUsers}/cancelFriendRequest/${user.username}`,
        ""
      );
      const updatedFriendRequest = friendRequestSent.filter((friend: any) => {
        return friend !== user.username;
      });
      setFriendRequestSent(updatedFriendRequest);
      showSnackbar("friend request cancled successfully", true);
    } catch (error) {
      showSnackbar("error while unfriend process!", false);
    }
  };

  const addFriendHandler = async () => {
    try {
      console.log(`add friend click`)
      const response = await postRequest(`${baseUrlUsers}/friendRequest/${user.username}`, "");
      setFriendRequestSent([...friendRequestSent, user.username])
      showSnackbar(response.message, true);
  } catch (error) {
    showSnackbar("error while sending request!", false);
    }
  };

  const acceptFriendHandler = async () => {
    try {
      const response = await putRequest(`${baseUrlUsers}/acceptFriendRequest/${user.username}`,"");
      let updateUserFriendRequests = userFriendRequests.filter((member: any) =>{
        return member.username !== user.username;
      })
      setUserFriendRequests(updateUserFriendRequests);
      await fetchFriendList();
      setPendingRequest([]);
    } catch (error) {
       showSnackbar("error while accepting request!", false);
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
          <div className="state-msg friend-state flex gap-4 justify-between items-center cursor-pointer hover:opacity-80">
            {isInFriendList.includes(user.username) ? (
              <p className="flex justify-between items-center" onClick={removeFriendHandler}>
                <span>Friends</span>
                <FaUserCheck />
              </p>
            ) : friendRequestSent.includes(user.username) ? (
              <p className="flex justify-between items-center" onClick={cancelRequestHandler} >
                <span>Friend Request Sent</span>
                <FaUserClock />
              </p>
            ) : pendingRequests.includes(user.username) ? (
              <p className="flex justify-between items-center" onClick={acceptFriendHandler} >
                <span>Accept</span>
                <FaUserCheck />
              </p>
            ) 
            : (
              <p className="flex justify-between items-center" onClick={addFriendHandler}>
                <span>Add Friend</span>
                <FaUserPlus />
              </p>
            )}
          </div>
        <div className="block-state">
          <div className="block-btn">
            {blockedUsers.includes(user.username) ? (
              <button className="unblock-btn" onClick={handleUnblock}>
                Unblock
              </button>
            ) : (
              <button className="block-btn" onClick={handleBlock}>
                Block
              </button>
            )}
          </div>
        </div>
        <div className="stats">
          <div className="stat-item">
            <h4>Total Games</h4>
            <p>{user && user.totalGames}</p>
          </div>
          <div className="stat-item">
            <h4>Wins</h4>
            <p>{user && user.wins}</p>
          </div>
          <div className="stat-item">
            <h4>Losses</h4>
            <p>{user && user.losses}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
