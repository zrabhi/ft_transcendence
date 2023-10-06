import React from 'react';

import './UserCard.scss';

export default function UserCard(user: any) {
  user = user.user;
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
        <div className="friend-state">
          Friend
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
