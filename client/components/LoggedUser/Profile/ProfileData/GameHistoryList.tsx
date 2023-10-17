import React from 'react'
import Image from 'next/image';

export default function GameHistoryList({gameList}: any) {
  return (
    <div className="game-history">
      <div className="game-history-header mt-4 flex justify-evenly items-center ">
        <div className="winner p-2 bg-green-400">
          Winner
        </div>
        <div className="score p-2 bg-slate-400">
          Score
        </div>
        <div className="loser p-2 bg-red-400 ">
          Loser
        </div>
      </div>
      <div className="list flex flex-col">
      {
        gameList.map((game: any, index: number) => (
          <div key={index} className="game-history-item flex justify-center items-center gap-8 my-4 hover:bg-purple-700 hover:bg-opacity-20 p-2">
            <div className="winner-side w-2/5">
              <div className="user-data flex flex-col gap-2 items-center">
                <div className="avatar rounded-full overflow-hidden border border-green-500">
                  <Image 
                    src={game.winner.avatar}
                    alt="Winner avatar"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="username">
                  {game.winner.username}
                </div>
              </div>
            </div>
            <div className="score text-3xl font-bold flex justify-center gap-4">
              <div className="winner-score ">
                {game.winnerScore}
              </div>
              <div className="delimeter">
                -
              </div>
              <div className="loser-score ">
                {game.loserScore}
              </div>
            </div>
            <div className="loser-side  w-2/5">
              <div className="user-data flex flex-col gap-2 items-center">
                  <div className="avatar rounded-full overflow-hidden border border-red-500">
                    <Image 
                      src={game.loser.avatar}
                      alt="Winner avatar"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="username">
                    {game.loser.username}
                  </div>
                </div>
              </div>
            </div>
        ))
      }
      </div>
    </div>
  )
}
