import React from 'react'
import Image from 'next/image'
import GameHistoryImage from '@/public/images/game-history.gif'
import './GameHistory.scss'

export default function GameHistory() {
  return (
    <div className="about">
      <div className="container text-center flex flex-col items-center">
        <h2 className='text-5xl my-4 font-bold' >Pong History</h2>
        <p className='text-base tracking-widest my-12 leading-10 w-4/5 mx-auto' >
          Pong, often regarded as the pioneer of video games, emerged onto the scene in the early 1970s. Created by Atari co-founder Nolan Bushnell, Pong marked the birth of the arcade gaming era and became a cultural phenomenon. With its simple yet addictive gameplay, Pong captured the imagination of players worldwide, laying the foundation for the multi-billion-dollar video game industry we know today. Its legacy endures as a testament to the power of innovation and the timeless appeal of interactive entertainment.
        </p>
        <div className="img p-2 overflow-hidden rounded-lg brightness-90 hover:brightness-100 ease-in-out duration-200">
          <Image 
            src={GameHistoryImage}
            alt="game history"
          />
        </div>
      </div>
    </div>
  )
}
