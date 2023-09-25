'use client';
import HeaderBar from '@/components/LoggedUser/Profile/HeaderBar/HeaderBar';
import SideBar from '@/components/LoggedUser/SideBar/SideBar'
import React from 'react'
import './style.css' 

export default function Game() {
	const [selectedMapColor, setSelectedMapColor] = React.useState('#000000');
	const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  return (
	<div className="logged-user">
		<SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
		<div className={`game ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
			<div className="game-content min-h-screen p-8">
				<HeaderBar />
				<div className="core flex  flex-col min-h-screen ">
				<div className="maps flex justify-between space-x-8">
				<div
					className="map map1 bg-black"
					onClick={() => setSelectedMapColor('#000000')}
				>black</div>
				<div
					className="map map2 bg-green-800"
					onClick={() => setSelectedMapColor('#023020')}
				>green</div>
				<div
					className="map map3 bg-blue-800"
					onClick={() => setSelectedMapColor('#0047AB')}
				>blue</div>
				<div
					className="map map4 bg-fuchsia-900"
					onClick={() => setSelectedMapColor('#800080')}
				>violet</div>
				<div
					className="map map5 bg-orange-600"
					onClick={() => setSelectedMapColor('#CC5500')}
				>orange</div>
				</div>
					<div className="subcore flex-1 flex">
					<div className={`arena flex flex-1 flex-col`} style={{ backgroundColor: selectedMapColor }}>
							<div className="presstext flex-1 text-5xl">PRESS START</div>
							<div className="button text-4xl">START</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
  )
}
