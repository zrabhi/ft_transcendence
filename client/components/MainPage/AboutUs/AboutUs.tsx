import React from 'react'
import ybadaouiImage from '@/public/authors/ybadaoui.jpeg'
import zrabhiImage from '@/public/authors/zrabhi.jpeg'
import mmoumniImage from '@/public/authors/mmoumni.jpeg'
import mkarimImage from '@/public/authors/mkarim.jpeg'
import AuthorCard from './AuthorCard/AuthorCard'
import './AboutUs.scss'

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
      name: 'Mohamed MOUMNI',
      imageSrc: mmoumniImage,
      linkedinUrl: 'https://www.linkedin.com/in/mmoumni/',
      githubUrl: 'https://github.com/Mohamed-Moumni/',
    },
    {
      name: 'Mohamed KARIM',
      imageSrc: mkarimImage,
      linkedinUrl: 'https://www.linkedin.com/in/skeet1/',
      githubUrl: 'https://github.com/skeet1/',
    },
  ];

  return (
    <div className="about-us">
        <div className="authors">
          {
            authors.map((author, index) => (
              <AuthorCard
                key={index}
                name={author.name}
                imageSrc={author.imageSrc}
                linkedinUrl={author.linkedinUrl}
                githubUrl={author.githubUrl}
              />
            ))
          }
        </div>
    </div>
  )
}
