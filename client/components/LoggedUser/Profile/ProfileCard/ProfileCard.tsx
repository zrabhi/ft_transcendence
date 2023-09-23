import React from 'react';
import Image from 'next/image';
import AvatarImage from '@/public/images/DefaultAvatar.jpg'; // Import your avatar image
import DefaultCover from '@/public/images/DefaultCover.jpeg'; // Import your cover image
import './ProfileCard.scss'

export default function ProfileCard({ user }: any) {
  return (
    <div className="profile-card text-main-text-color shadow-lg p-6">
      <div className="relative h-32 w-full mb-4 overflow-hidden">
        <Image
          src={DefaultCover}
          layout="fill"
          objectFit="cover"
          alt="Statistics Cover"
          className='bg-fixed bg-no-repeat'
        />
      </div>

      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
        <Image
          src={user && user.data && user.data.avatar ? user.data.avatar : AvatarImage}
          layout="fill"
          objectFit="cover"
          alt="User Avatar"
        />
      </div>

      {/* User Info */}
      <div className="text-center">
        {/* Display the user's username */}
        <h2 className="text-xl font-semibold">{user && user.data && user.data.username}</h2>

        {/* User Statistics */}
        <div className="mt-2">
          {/* Customize and display user statistics */}
          <div className="mb-2">
            <span className="text-gray-400">Total Games:</span>{' '}
            {user && user.data && user.data.totalGames}
          </div>
          <div className="mb-2">
            <span className="text-gray-400">Win Rate:</span>{' '}
            {user && user.data && user.data.winRate}
          </div>
          <div>
            <span className="text-gray-400">Ladder Rank:</span>{' '}
            {user && user.data && user.data.ladderRank}
          </div>
        </div>
        <div className="mt-4">
          {user && user.data && user.data.discordHandler && (
            <a
              href={user.data.discordHandler}
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft-gold-color hover:text-light-gold-color mr-4"
            >
              Discord
            </a>
          )}
          {user && user.data && user.data.twitterHandler && (
            <a
              href={user.data.twitterHandler}
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft-gold-color hover:text-light-gold-color"
            >
              Twitter
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
