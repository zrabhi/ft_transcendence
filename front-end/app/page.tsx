// 'use client'
import "../public/logo.svg"
import Navbar from './../components/Navbar'

export default function Home() {
  return (
    <div className='home' >
      <div className="hero-section">
        <div className="container-box">
          <Navbar />
          {/* <MainContent /> */}
          {/* <ScrollDown /> */}
        </div>
      </div>
    </div>
  )
}
