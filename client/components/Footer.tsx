import Link from 'next/link'
import './styles/Footer.scss'

export default function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <p>
          Made with Love by <Link href="https://github.com/skeet1" target='_blank'>Skeet</Link> 
          <Link href="https://github.com/Mohamed-Moumni" target='_blank'> Rigor</Link>
          <Link href="https://github.com/zrabhi" target='_blank'> zack</Link>
          <Link href="https://github.com/youssef-badaoui" target='_blank'> YOS3F</Link>
        </p>
      </div>
    </div>
  )
}
