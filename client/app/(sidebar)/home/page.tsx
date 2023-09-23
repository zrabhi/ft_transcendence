'use client';
import HeaderBar from '@/components/LoggedUser/Profile/HeaderBar/HeaderBar';
import SideBar from '@/components/LoggedUser/SideBar/SideBar'
import React from 'react'

export default function Home() {

	const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  return (
	<div className="logged-user">
		<SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
		<div className={`home ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
			<div className="home-content min-h-screen p-8">
				<HeaderBar />
				<h2 className='text-2xl bg-slate-400 text-white mx-auto my-4 text-center uppercase'>
					This is the home page of logged user
				</h2>
			</div>
		</div>
	</div>
  )
}
