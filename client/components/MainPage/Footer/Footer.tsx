import Link from 'next/link'
import './Footer.scss'

export default function Footer() {
  return (
    <div className="footer">
      <p>
        <span>Made with Love by</span> 
        <Link href="https://github.com/skeet1" target='_blank'>Skeet</Link>
        <Link href="https://github.com/zrabhi" target='_blank'> Zac</Link>
        <Link href="https://github.com/youssef-badaoui" target='_blank'> YOS3F</Link>
      </p>
    </div>
  )
}
