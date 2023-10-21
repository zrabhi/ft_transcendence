import Image from 'next/image'
import HomeImage from '@/public/images/home_image.png'
import './MainContent.scss'

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="container">
      <h1>Welcome to Pong Pro: The Ultimate Table Tennis Experience</h1>
      <h2>Join our vibrant community of top-notch pong players</h2>
      <p>Experience the thrill of intense matches, where skill and strategy converge to create unforgettable moments. Join us now to be a part of the action!</p>
        <div className="img">
          <Image
            src={HomeImage}
            width={500}
            height={500}
            alt='a women descripe a pong game to a child'
          />
        </div>
      </div>
    </div>
  );
}

export default MainContent