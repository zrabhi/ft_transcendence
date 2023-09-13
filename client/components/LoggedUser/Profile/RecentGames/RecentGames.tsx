import React from 'react'
import Image from 'next/image'
import winImage from '@/public/recent-games/win.png'
import loseImage from '@/public/recent-games/lose.png'
import drawImage from '@/public/recent-games/draw.png'
import './RecentGames.scss'

const recentGames = [
	{
		against: 'mike',
		result: 'win',
	},
	{
		against: 'two',
		result: 'draw',
	},
	{
		against: 'three',
		result: 'loss',
	},
	{
		against: 'four',
		result: 'loss',
	},
];

export default function RecentGames() {
  return (
	<div className="recent-games">
		{
		recentGames.slice(0, 3).map((game, index) => (
			<div key={index} className='game'>
				<div className="img">
					{game.result === 'win' && (
						<Image
						src={winImage}
						width={60}
						height={60}
						alt='Win game result image'
						/>
					)}
					{game.result === 'loss' && (
						<Image
						src={loseImage}
						width={60}
						height={60}
						alt='Loss game result image'
						/>
					)}
					{game.result === 'draw' && (
						<Image
						src={drawImage}
						width={60}
						height={60}
						alt='Draw game result image'
						/>
					)}
				</div>
				<p className=''>
					{game.result} the game against {game.against}
				</p>
			</div>
		))
		}
  	</div>
  )
}
