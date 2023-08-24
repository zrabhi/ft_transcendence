import React from 'react'
import Navbar from '@/components/MainPage/NavBar/Navbar'
import MainContent from '@/components/MainPage/MainContent/MainContent'
import GameHistory from '@/components/MainPage/GameHistory/GameHistory'
import './ContainerBox.scss'

export default function ContainerBox({component}: any) {
  return (
    <div className="container-box">
          <Navbar />
          <div className="grow bottom-of-nav flex justify-center items-center ">
            {component === "MainContent" && <MainContent />}
            {component === "GameHistory" && <GameHistory />}
          </div>
    </div>
  )
}

