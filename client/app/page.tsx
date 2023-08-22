// 'use client'
import "../public/logo.svg"
import './hero-section.scss'
import Navbar from '../components/MainPage/NavBar/Navbar'
import MainContent from '../components/MainPage/MainContent/MainContent'
import ScrollDown from '../components/MainPage/ScrollDown/ScrollDown'

export default function Home() {
  return (
    <div className='home' >
      <div className="hero-section">
        <div className="container-box">
          <Navbar />
          <MainContent />
          <ScrollDown />
        </div>
      </div>
    </div>
  )
}
