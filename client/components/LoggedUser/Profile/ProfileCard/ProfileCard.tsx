import React from 'react';
import Image from 'next/image';

import './ProfileCard.scss';

export default function ProfileCard(user: any) {
  return (
    <div className="profile-card w-full relative ">
      <div className="background"></div>
      <div className="avatar">
        <Image
          src={
            user.data && user.data.avatar && !user.data.avatar.includes('googleusercontent')
              ? user.data.avatar
              : '/images/DefaultAvatar.jpg'
          }
          alt="User Avatar"
          width={200}
          height={200}
        />
      </div>
      <div className="user-details">
        <h2>{user.data && user.data.username}</h2>
        <div className="stats">
          <div className="stat-item">
            <h4>Total Games</h4>
            <p>{user.data && user.data.win + user.data.loss}</p>
          </div>
          <div className="stat-item">
            <h4>Wins</h4>
            <p>{user.data && user.data.win}</p>
          </div>
          <div className="stat-item">
            <h4>Losses</h4>
            <p>{user.data && user.data.loss}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
