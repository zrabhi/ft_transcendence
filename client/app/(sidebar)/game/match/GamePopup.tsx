// components/GamePopup.tsx

import React from 'react';
import { useRouter } from 'next/router';

interface GamePopupProps {
  message: string;
}

const GamePopup: React.FC<GamePopupProps> = ({ message }) => {
//   const router = useRouter();

  const handleNewGameClick = () => {
    // Redirect to the game match page
    // router.push('/game/match');
  };

  const handleBackHomeClick = () => {
    // Redirect to the profile page
    // router.push('/profile');
  };

  return (
    <div className="game-popup">
      <div className="message">{message}</div>
      <div className="buttons">
        <button onClick={handleNewGameClick}>New Game</button>
        <button onClick={handleBackHomeClick}>Back Home</button>
      </div>
    </div>
  );
};

export default GamePopup;
