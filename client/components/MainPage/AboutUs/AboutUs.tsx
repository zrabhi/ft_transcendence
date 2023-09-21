'use client'
import React from 'react'
import ybadaouiImage from '@/public/authors/ybadaoui.jpeg'
import zrabhiImage from '@/public/authors/zrabhi.jpeg'
import mkarimImage from '@/public/authors/mkarim.jpeg'
import obakhtiImage from '@/public/authors/obakhti.jpeg'
import hmzahImage from '@/public/authors/hmzah.jpeg'
import AuthorCard from './AuthorCard/AuthorCard'
import './AboutUs.scss'
import { motion } from 'framer-motion'

export default function AboutUs() {
  
  const authors = [
    {
      name: 'Youssef BADAOUI',
      imageSrc: ybadaouiImage,
      linkedinUrl: 'https://www.linkedin.com/feed/',
      githubUrl: 'https://github.com/youssef-badaoui/',
    },
    {
      name: 'Zakaria RABHI',
      imageSrc: zrabhiImage,
      linkedinUrl: 'https://www.linkedin.com/in/zakaria-rabhi-a3b5aa228/',
      githubUrl: 'https://github.com/zrabhi/',
    },
    {
      name: 'Mohamed KARIM',
      imageSrc: mkarimImage,
      linkedinUrl: 'https://www.linkedin.com/in/skeet1/',
      githubUrl: 'https://github.com/skeet1/',
    },
    {
      name: 'Oussama Bakhti',
      imageSrc: obakhtiImage,
      linkedinUrl: 'https://www.linkedin.com/in/oussama-bakhti',
      githubUrl: 'https://github.com/OussamaBakhti/',
    },
    {
      name: 'Hatim MZAH',
      imageSrc: hmzahImage,
      linkedinUrl: 'https://www.linkedin.com/in/hatimmzah/',
      githubUrl: 'https://github.com/mza7a/',
    },
  ];
  
    const container = {
      hidden: { opacity: 1, scale: 0 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          delayChildren: 0.2,
          staggerChildren: 0.4
        }
      }
    };
    
    const item = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1
      }
    };

  const MotionAuthCard = motion(AuthorCard);

  return (
    <div className="about-us">
        <motion.div 
          className="authors"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {
            authors.map((author, index) => (
              <motion.div 
                key={index} 
                variants={item}
              >
                <AuthorCard
                  className="item"
                  name={author.name}
                  imageSrc={author.imageSrc}
                  linkedinUrl={author.linkedinUrl}
                  githubUrl={author.githubUrl}
                />
              </motion.div>
            ))
          }
        </motion.div>
    </div>
  )
}
