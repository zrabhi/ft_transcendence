import Image from 'next/image'
import HomeImage from '@/public/images/home_image.png'
import './MainContent.scss'

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="container">
        <h1>Play Pong: The Classic Table Tennis Game</h1>
        <h2>Here you can discover the best pong gamers network</h2>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus facere nostrum quibusdam, iure dignissimos nisi necessitatibus quidem ipsam tempore minus adipisci tempora fugiat doloremque natus totam obcaecati alias mollitia praesentium.</p>
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