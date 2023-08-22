import React from 'react'
import './style.scss'
import SideBar from '@/components/LoggedUser/SideBar/SideBar'
import ProfileCard from '@/components/LoggedUser/Profile/ProfileCard/ProfileCard'

export default function Profile() {
  return (
    <div className="profile-page text-white">
      <SideBar />
      <div className="profile">
        <div className="profile-content">
          <ProfileCard />
        </div>
      </div>
    </div>
  )
}
