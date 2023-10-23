import React from 'react'
import Image from 'next/image'
import ybadaoui from '@/public/authors/ybadaoui.jpeg'
import zrabhi from '@/public/authors/zrabhi.jpeg'
import './GameData.scss'

export default function GameData ({ game }: any) {

  const handleAvatarClick = (username: string) => {
    // here i'll redirect to the user profile page
    // // console.log(`clicked on ${username}`)
  }

  return (
    <div className='game-data' >
      <div className="winner">
        <span className="state text-green-600">Winner</span>
        <div className="avatar" onClick={() => handleAvatarClick(game.winner)}>
          <Image 
            className="rounded-full"
            src={zrabhi}
            width={70}
            height={70}
            alt="winner avatar"
          />
        </div>
        <p className="name winer-username">{game.winner}</p>
      </div>
      <div className="result">
        <span className='text-green'>{game.winner_score}</span>
        <span>:</span>
        <span className='text-red'>{game.loser_score}</span>
      </div>
      <div className="loser">
        <span className="state text-red-600">loser</span>
        <div className="avatar" onClick={() => handleAvatarClick(game.loser) }>
          <Image 
            className='rounded-full'
            src={ybadaoui}
            width={70}
            height={70}
            alt="loser avatar"
          />
        </div>
        <p className="name loser-username">{game.loser}</p>
      </div>
    </div>
  )
}
