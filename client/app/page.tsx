import "@/public/images/logo.svg"
import './hero-section.scss'
import Navbar from './../components/MainPage/NavBar/Navbar'
import MainContent from './../components/MainPage/MainContent/MainContent';
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'

export default function Home() {
  return (
      <div className='home' >
        <Theme>
          <div className="hero-section">
            <div className="container-box">
              <Navbar />
              <MainContent />
            </div>
          </div>
        </Theme>
      </div>
  )
}
