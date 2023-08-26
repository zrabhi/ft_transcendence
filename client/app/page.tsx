import "@/public/images/logo.svg"
import './hero-section.scss'
import ContainerBox from '@/components/MainPage/ContainerBox/ContainerBox'

export default function Home() {
  return (
    <div className='home' >
      <div className="hero-section">
        <ContainerBox component="MainContent" />
      </div>
    </div>
  )
}
