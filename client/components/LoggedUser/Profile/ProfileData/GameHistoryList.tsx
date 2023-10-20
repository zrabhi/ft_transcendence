import React from 'react';
import Image from 'next/image';

export default function GameHistoryList({ gameList }: any) {
  if (gameList.length === 0) {
    return (
      <div className="no-games">
        <div className="text-2xl font-bold mt-4 text-center ">No games played yet</div>
      </div>
    );
  }
  return (
    <div className="game-history">
      <div className="game-history-header mt-4 flex justify-evenly items-center text-center bg-purple-400 bg-opacity-40 py-3 font-bold text-xl tracking-wider rounded-t-[.5rem] ">
        <div className="column w-2/5 ">Winner</div>
        <div className="column w-1/5 ">Score</div>
        <div className="column w-2/5 ">Loser</div>
      </div>
      <div className="list flex flex-col">
        {gameList.map((game: any, index: number) => (
          <div
            key={index}
            className="game-history-item flex justify-center items-center hover:bg-purple-400 hover:bg-opacity-30 py-4"
          >
            <div className="winner-side column w-2/5">
              <div className="user-data flex flex-col gap-2 items-center">
                <div className="avatar rounded-full overflow-hidden border-2 border-green-500 w-16 h-16">
                  <Image
                    src={game.winner.avatar}
                    alt="Winner avatar"
                    width={100}
                    height={100}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className="username">{game.winner.username}</div>
              </div>
            </div>
            <div className="column w-1/5 text-3xl font-bold flex justify-center gap-4">
              <div className="winner-score">{game.winnerScore}</div>
              <div className="delimeter">-</div>
              <div className="loser-score">{game.loserScore}</div>
            </div>
            <div className="column w-2/5">
              <div className="user-data flex flex-col gap-2 items-center">
                <div className="avatar rounded-full overflow-hidden border-2 border-red-500">
                  <Image
                    src={game.loser.avatar}
                    alt="Winner avatar"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="username">{game.loser.username}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}