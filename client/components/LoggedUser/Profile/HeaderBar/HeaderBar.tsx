import React from 'react'
import SearchBar from '@/components/LoggedUser/Profile/HeaderBar/SearchBar/SearchBar'
import Notification from '@/components/LoggedUser/Profile/HeaderBar/Notification/Notification'
import { IoMdSearch } from 'react-icons/io'
import { BsBellFill } from 'react-icons/Bs'
import './HeaderBar.scss'
import PopUpModal from '@/components/LoggedUser/Profile/PopUpModal/PopUpModal'

export default function HeaderBar() {

  const [showModal, setShowModal] = React.useState(false)

  return (
    <div className="header-bar">
      <div className="title">
        <h1 className='text-white'>Welocme Back</h1>
      </div>
      <div className="icons">
        <IoMdSearch className="icon" onClick={() => setShowModal(true)} />
        <BsBellFill className="icon" onClick={() => setShowModal(true)} />
        <PopUpModal isVisible={showModal} close={() => setShowModal(false)} />
      </div>
    </div>
  )
}
