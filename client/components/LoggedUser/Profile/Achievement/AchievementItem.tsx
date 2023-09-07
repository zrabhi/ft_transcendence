import React from 'react';
import Achievement from '@/interfaces/Achievement';
import './AchievementItem.scss';

interface Props {
  achievement: Achievement;
}

export default function AchievementItem ({ achievement }: any) {
  return (
    <div className="achievement-item">
      <h5 className='name'>{achievement.name}</h5>
      <p className="desc">
        {achievement.description}
      </p>
    </div>
  );
};
