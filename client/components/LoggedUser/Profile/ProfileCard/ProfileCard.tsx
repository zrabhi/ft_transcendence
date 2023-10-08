import React from 'react';

import './ProfileCard.scss';

export default function ProfileCard(user: any) {
  return (
    <div className="profile-card w-full relative ">
      <div className="background"></div>
      <div className="avatar">
        <img
          src={
            user.data && user.data.avatar && !user.data.avatar.includes('googleusercontent')
              ? user.data.avatar
              : '/images/DefaultAvatar.jpg'
          }
          alt="User Avatar"
        />
      </div>
      <div className="user-details">
        <h2>{user.data && user.data.username}</h2>
        <div className="stats">
          <div className="stat-item">
            <h4>Total Games</h4>
            <p>{user.data && user.data.totalGames}</p>
          </div>
          <div className="stat-item">
            <h4>Wins</h4>
            <p>{user.data && user.data.wins}</p>
          </div>
          <div className="stat-item">
            <h4>Losses</h4>
            <p>{user.data && user.data.losses}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
