import "@/public/images/logo.svg"
import './hero-section.scss'
import Navbar from './../components/MainPage/NavBar/Navbar'
import MainContent from './../components/MainPage/MainContent/MainContent';
import { useCookies } from "react-cookie";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

// export function getCookie(cookieLable: string) {
// 	if (typeof document === 'undefined')
// 		return ;
//     const cookies = document.cookie.split('; ');
//     for (const cookie of cookies) {
//         const [label, content] = cookie.split('=');
//         if (label === cookieLable)
//           return (content);
//     }
// 	return (undefined)
// }

export default function Home() {

  return (
      <div className='home' >
        <div className="hero-section">
          <div className="container-box">
            <Navbar />
            <MainContent />
          </div>
        </div>
      </div>
  )
}
