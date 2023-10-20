'use client'
import React from 'react'
import HeaderBar from '@/components/LoggedUser/Profile/HeaderBar/HeaderBar';
import SideBar from '@/components/LoggedUser/SideBar/SideBar'
import { useRouter } from 'next/navigation';
import './style.scss'


export default function Game() {
	const [selectedMapColor, setSelectedMapColor] = React.useState('#000000');
	const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
	const router = useRouter();
	
	function startfunc()
	{
		localStorage.setItem('selectedMapColor', selectedMapColor);
		router.push('/game/match');
	}
  return (
	<div className="logged-user">
		<SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
		<div className={`game ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
			<div className="game-content h-screen p-8">
				<HeaderBar />
				<div className="core flex  flex-col">
					<div className="maps flex justify-between ">
					<div
						className="map map1 bg-black"
						onClick={() => setSelectedMapColor('#000000')}
					></div>
					<div
						className="map map2 bg-green-800"
						onClick={() => setSelectedMapColor('#023020')}
					></div>
					<div
						className="map map3 bg-blue-800"
						onClick={() => setSelectedMapColor('#0047AB')}
					></div>
					<div
						className="map map4 bg-fuchsia-900"
						onClick={() => setSelectedMapColor('#800080')}
					></div>
					<div
						className="map map5 bg-orange-600"
						onClick={() => setSelectedMapColor('#CC5500')}
					></div>
				</div>
					<div className="subcore flex-1 flex">
					<div className={`arena flex flex-1 flex-col`} style={{ backgroundColor: selectedMapColor }}>
							<div className="presstext flex-1  flex " style={{ backgroundColor: selectedMapColor }} >PRESS START</div>
							<div className="button cursor-pointer" onClick={startfunc}>START</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
  )
}
