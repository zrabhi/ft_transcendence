import React from 'react'
import './style.scss'
import Logo from '@/components/Logo'
import { CgHomeAlt , CgProfile, CgGames } from 'react-icons/cg'
import { PiTelevisionFill, PiChatsFill } from 'react-icons/pi'
import { IoMdSettings, IoMdExit } from 'react-icons/io'

export default function SideBar() {
  return (
    <div className="sidebar">
      <Logo />
      <div className="sidebar-nav">
        <div className="to-home">
          <CgHomeAlt size={24} className="icon" />
        </div>
        <div className="to-profile">
          <CgProfile size={24} className="icon" />
        </div>
        <div className="to-chat">
          <PiChatsFill size={24} className="icon" />
        </div>
        {/* <div className="to-live">
          <PiTelevisionFill size={24} className="icon" />
        </div> */}
        <div className="to-game">
          <CgGames size={24} className="icon" />
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="to-settings">
          <IoMdSettings size={24} className="icon" />
        </div>
        <div className="to-signout">
          <IoMdExit size={24} className="icon" />
        </div>
      </div>
    </div>
  )
}
