'use client';
import HeaderBar from '@/components/LoggedUser/Profile/HeaderBar/HeaderBar';
import SideBar from '@/components/LoggedUser/SideBar/SideBar'
import React from 'react'
import './style.css' 

export default function Game() {

	const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  return (
<<<<<<< HEAD
	<div className="logged-user"> 
		<SideBar />
			<div className="game">
				<h1 className="head">welcome to the game page</h1>
				<h3 className="subhead">click start to play a random match or invite to invite a friend </h3>
				<div className="buttons">
					<button className="random">Random</button>
					<button className="invite">invite</button>
				</div>
=======
	<div className="logged-user">
		<SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
		<div className={`game ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
			<div className="game-content min-h-screen p-8">
				<HeaderBar />
				<h2 className='text-2xl bg-slate-400 text-white mx-auto my-4 text-center uppercase'>
					This is the game page
				</h2>
			</div>
>>>>>>> dev
		</div>
	</div>
  )
}
