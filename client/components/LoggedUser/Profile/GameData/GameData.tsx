import React from 'react'
import Image from 'next/image'

export default function GameData ({ game }: any) {
  return (
    <div className='game-data' >
      <div className="winner">
        <span className="text-green">Winner : {game.winner}</span>
        <div className="avatar">
          <Image 
            src='https://placehold.co/100'
            width={100}
            height={100}
            alt="winner avatar"
          />
        </div>
      </div>
      <div className="loser">
        <span className="text-green">loser : {game.loser}</span>
        <div className="avatar">
          <Image 
            src='https://placehold.co/100'
            width={100}
            height={100}
            alt="loser avatar"
          />
        </div>
      </div>
    </div>
  )
}
