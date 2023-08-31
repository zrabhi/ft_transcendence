"use client"
import React, { useEffect, useState } from 'react'
import './ProfileCard.scss'
import Image from 'next/image'
import CoverImage from '@/public/images/FetchCoverImage.png'
import { BsTwitter, BsDiscord } from 'react-icons/Bs'
import Avatar from '@/public/images/DefaultAvatar.jpg'

export default function ProfileCard(user: any) {

  // console.log(typeof user.data.username, user.data.username);

  return (
    <div className="profile-card">
      {/* <span className="span bg-slate-800 text-white block">
        { user.data && user.data.avatar }
        Image is : {user.data && user.data.avatar}
        <Image 
          src={user.data && user.data.avatar}
          width={100}
          height={100}
          alt='image of uesr'
        />
      </span> */}
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
        <div className="right">
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
            src={user.data && user.data.avatar && !user.data.avatar.includes('googleusercontent') ? user.data.avatar : Avatar}

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