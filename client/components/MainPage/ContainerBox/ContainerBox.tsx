import React from 'react'
import Navbar from '@/components/MainPage/NavBar/Navbar'
import MainContent from '@/components/MainPage/MainContent/MainContent'
import GameHistory from '@/components/MainPage/GameHistory/GameHistory'
import Instructions from '@/components/MainPage/Instructions/Instructions'
import AboutUs from '@/components/MainPage/AboutUs/AboutUs'
import './ContainerBox.scss'

export default function ContainerBox({component}: any) {
  return (
    <div className="container-box">
      <Navbar />
      <div className="box flex justify-center items-center ">
        {component === "MainContent" && <MainContent />}
        {component === "GameHistory" && <GameHistory />}
        {component === "instructions" && <Instructions />}
        {component === "AboutUs" && <AboutUs />}
      </div>
    </div>
  )
}
