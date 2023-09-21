import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import './AuthorCard.scss'

export default function AuthorCard({name, imageSrc, linkedinUrl, githubUrl }: any) {
  return (
    <div className="author">
      <div className="content">
        <h2>{name}</h2>
        <Image src={imageSrc} width={200} height={200} alt={`${name} IMAGE`} />
        <div className="links">
          <div className="linkedin">
            <Link href={linkedinUrl} target="_blank">
              <FaLinkedin />
            </Link>
          </div>
          <div className="github">
            <Link href={githubUrl} target="_blank">
              <FaGithub />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
