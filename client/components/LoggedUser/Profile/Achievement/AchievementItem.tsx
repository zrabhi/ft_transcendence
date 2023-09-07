import React from 'react';
import Achievement from '@/interfaces/Achievement';
import './AchievementItem.scss';
import Image from 'next/image';
import firstVictory from '@/public/achievements/first-victory.jpeg';

interface Props {
  achievement: Achievement;
}

export default function AchievementItem ({ achievement }: any) {
  return (
    <div className="achievement-item">
      <div className="icon">
        <Image
          src={firstVictory}
          width={50}
          height={50}
          alt="achievement image"
        />
      </div>
      <div className="content">
        <h5 className='name'>{achievement.name}</h5>
        <p className="desc">
          {achievement.description}
        </p>
      </div>
    </div>
  );
};
