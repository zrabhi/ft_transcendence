import React from 'react';
import Image from 'next/image';

export default function GameHistoryList({ gameList }: any) {
  return (
    <div className="game-history">
      <div className="game-history-header mt-4 flex justify-evenly items-center text-center bg-purple-800 bg-opacity-50 py-3 font-bold text-xl tracking-wider rounded">
        <div className="column w-2/5 ">Winner</div>
        <div className="column w-1/5 ">Score</div>
        <div className="column w-2/5 ">Loser</div>
      </div>
      <div className="list flex flex-col">
        {gameList.map((game: any, index: number) => (
          <div
            key={index}
            className="game-history-item flex justify-center items-center my-4 hover:bg-purple-700 hover:bg-opacity-20"
          >
            <div className="winner-side column w-2/5">
              <div className="user-data flex flex-col gap-2 items-center">
                <div className="avatar rounded-full overflow-hidden border border-green-500">
                  <Image
                    src={game.winner.avatar}
                    alt="Winner avatar"
                    width={80}
                    height={80}
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
                <div className="avatar rounded-full overflow-hidden border border-red-500">
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
