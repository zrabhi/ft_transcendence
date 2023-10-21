import React from 'react';
import Image from 'next/image';
import winImage from '@/public/stats/win.png';
import lossImage from '@/public/stats/loss.png';
import scoredImage from '@/public/stats/goalsScored.png';
import receivedImage from '@/public/stats/goalsRecieved.png';
import Stat from './Stat';

export default function StatsData({ user }: any) {
  return (
    <div className="mx-auto p-4 mt-4 rounded-[.5rem] shadow-md">
      <div className="text-data flex flex-col gap-1">
        <Stat icon={winImage} label="Wins" value={user.win} />
        <Stat icon={lossImage} label="Losses" value={user.loss} />
        <Stat icon={scoredImage} label="Goals Scored" value={user.totalGoalsScored} />
        <Stat icon={receivedImage} label="Goals Received" value={user.totalGoalsRecieved} />
      </div>
    </div>
  );
}
