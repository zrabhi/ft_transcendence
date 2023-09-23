import SideBar from '@/components/LoggedUser/SideBar/SideBar'
import React from 'react'
import './style.css' 

export default function Game() {
  return (
	<div className="logged-user"> 
		<SideBar />
			<div className="game">
				<h1 className="head">welcome to the game page</h1>
				<h3 className="subhead">click start to play a random match or invite to invite a friend </h3>
				<div className="buttons">
					<button className="random">Random</button>
					<button className="invite">invite</button>
				</div>
		</div>
	</div>
  )
}
