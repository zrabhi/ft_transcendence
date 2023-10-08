import React, { useContext } from "react";
import { FaUserClock, FaUserCheck, FaUserPlus } from "react-icons/fa";

// faUserPlust for not friend
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
    setfriendsList,
    friendRequestSent,
    setFriendRequestSent,
  } = useContext(AuthContext);
  user = user.user;
  // user.isFriend = true;
  // user.friendRequestSent = true;

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
        return friend !== user.username;
      });
      setfriendsList(updatedFriendsList);
    } catch (error) {
      showSnackbar("error while unfriend process!", false);
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
      friendRequestSent(updatedFriendRequest);
    } catch (error) {
      showSnackbar("error while unfriend process!", false);
    }
  };

  const addFriendHandler = async () => {
    try {
      const response = await postRequest(`${baseUrlUsers}/friendRequest/${user.username}`, "");
      setFriendRequestSent([...friendRequestSent, user.username])
      showSnackbar(response.message, true);
  } catch (error) {
    showSnackbar("error while sending request!", false);
    }
  };
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
        <div className="friend-state flex gap-4 justify-between items-center cursor-pointer hover:opacity-80">
          <div className="state-msg">
            {friendsList.includes(user.username) ? (
              <p className="" onClick={removeFriendHandler}>
                Friends
              </p>
            ) : friendRequestSent.includes(user.username) ? (
              <p className="" onClick={cancelRequestHandler}>
                Friend Request Sent
              </p>
            ) : (
              <p className="" onClick={addFriendHandler}>
                Add Friend
              </p>
            )}
          </div>
          <div className="state-icon">
            { friendsList.includes(user.username) ? (
              <FaUserCheck />
            ) : friendRequestSent.includes(user.username) ? (
              <FaUserClock />
            ) : (
              <FaUserPlus />
            )}
          </div>
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
