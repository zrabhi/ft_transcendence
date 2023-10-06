import React from 'react';
import {FaUserClock, FaUserCheck, FaUserPlus } from 'react-icons/fa';
// faUserPlust for not friend
// faUserCheck for friend
// faUserClock for friend request sent

import './UserCard.scss';

export default function UserCard(user: any) {
  user = user.user;
  // user.isFriend = true;
  // user.friendRequestSent = true;

  return (
    <div className="user-card w-full relative ">
      <div className="background"></div>
      <div className="avatar">
        <img
          src={
            user && user.avatar && !user.avatar.includes('googleusercontent')
              ? user.avatar
              : '/images/DefaultAvatar.jpg'
          }
          alt="User Avatar"
        />
      </div>
      <div className="user-details">
        <h2>{user && user.username}</h2>
        <div className="friend-state flex gap-4 justify-between items-center cursor-pointer hover:opacity-80">
          <div className="state-msg">
            { user && user.isFriend ?
              <p className="">
                Friends
              </p>
              : user && user.friendRequestSent ?
              <p className="">
                Friend Request Sent
              </p>
              :
              <p className="">
                Add Friend
              </p>
            }
          </div>
          <div className="state-icon">
            { user && user.isFriend ?
              <FaUserCheck />
              : user && user.friendRequestSent ?
              <FaUserClock />
              :
              <FaUserPlus />
            }
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
