import React from 'react'
import './ProfileCard.scss'
import Image from 'next/image'
import CoverImage from '@/public/FetchCoverImage.png'
import { BsTwitter, BsDiscord } from 'react-icons/Bs'
import ReactCountryFlag from 'react-country-flag'
import Avatar from '@/public/DefaultAvatar.jpg'

export default function ProfileCard() {
  return (
    <div className="profile-card">
      <div className="cover-img">
        <Image 
          src={CoverImage}
          alt='cover image'
        />
      </div>
      <div className="info">
        <div className="left">
          <div className="total-games">
            <h4>total games</h4>
            Fetch: 15
          </div>
          <div className="state">
            <h4>stats</h4>
            Fetch: State Logo
          </div>
        </div>
        <div className="right">
          <div className="country">
            <h4>country</h4>
            <div className="flag">
              <ReactCountryFlag svg 
                countryCode='MA' 
                style={{
                  fontSize: '2rem', 
                  lineHeight:'2rem'
                }} 
              />
            </div>
          </div>
          <div className="social-media">
            <h4>social medias</h4>
            <div className="icons">
              <div className="discord icon">
                <BsDiscord />
              </div>
              <div className="twitter icon">
                <BsTwitter />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user">
        <div className="img relative w-4/5 mx-auto">
          <Image 
            src={Avatar}
            alt='Image of the user'
            className='rounded-full '
          />
          <div className="level w-8 h-8 rounded-full flex justify-center items-center absolute bottom-2 right-2">
            4
          </div>
        </div>
        <div className="username text-center m-2">
          username
        </div>
      </div>
    </div>
  )
}
