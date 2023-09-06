"use client"
import React, { useEffect, useState } from 'react'
import './ProfileCard.scss'
import Image from 'next/image'
import Link from 'next/link'
import CoverImage from '@/public/images/FetchCoverImage.png'
import { BsTwitter, BsDiscord } from 'react-icons/Bs'
import Avatar from '@/public/images/DefaultAvatar.jpg'

export default function ProfileCard(user: any) {

  return (
    <div className="profile-card">
      <div className="cover-img">
        <Image
          src={user.data && user.data.cover? user.data.cover : CoverImage}
          width={100}
          height={100}
          alt='cover image'
        />
      </div>
      <div className="info">
        <div className="first">
          <div className="total-games">
            <h4>total games</h4>
            {
              user.data && user.data.totalGames
            }
          </div>
          <div className="state">
            <h4>stats</h4>
            {
              // user.data && user.data.avatar 
            }
          </div>
        </div>
        <div className="second">
          <div className="social-media">
            <h4>social medias</h4>
            <div className="icons">
              {/* Discord  */}
              { (user.data && user.data.discordHandler && user.data.discordHandler.length >= 0 ) ?
                <div className="discord icon">
                  <Link href={user.data && user.data.discordHandler} target='_blank'>
                    <BsDiscord />
                  </Link>
                </div>
                : 
                <div className="discord icon grayscale pointer-none">
                  <BsDiscord />
                </div>
              }

              {/* Twitter */}
              { (user.data && user.data.twitterHandler && user.data.twitterHandler.length >= 0 ) ?
                <div className="discord icon">
                  <Link href={user.data && user.data.twitterHandler} target='_blank'>
                    <BsTwitter />
                  </Link>
                </div>
                : 
                <div className="discord icon grayscale pointer-none">
                  <BsTwitter />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="user">
        <div className="img relative w-4/5 mx-auto">
          <Image
            src={user.data && user.data.avatar && !user.data.avatar.includes('googleusercontent') ? user.data.avatar : Avatar}
            width={500}
            height={500}
            alt='Image of the user'
            className='rounded-full '
          />
          <div className="level w-8 h-8 rounded-full flex justify-center items-center absolute bottom-2 right-2">
          4
          </div>
        </div>
        <div className="username text-center m-2">
          {user.data &&
          user.data.username}
        </div>
      </div>
    </div>
  )
}