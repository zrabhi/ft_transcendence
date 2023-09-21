import SideBar from '@/components/LoggedUser/SideBar/SideBar'
import React from 'react'

export default function Home() {
  return (
	<div className="logged-user">
		<SideBar />
		<div className="home">
			<h2 className='text-2xl bg-slate-400 text-white mx-auto my-4 text-center uppercase'>
				This is the home page of logged user
			</h2>
		</div>
	</div>
  )
}
