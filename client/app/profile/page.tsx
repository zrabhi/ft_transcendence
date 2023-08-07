import React from 'react'
import './style.scss'
import SideBar from '@/components/SideBar/SideBar'
import ProfileCard from '@/components/Profile/ProfileCard/ProfileCard'

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
