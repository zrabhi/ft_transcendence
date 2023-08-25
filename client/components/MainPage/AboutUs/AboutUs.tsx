import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ybadaouiImage from '@/public/authors/ybadaoui.jpeg'
import zrabhiImge from '@/public/authors/zrabhi.jpeg'
import mmoumniImage from '@/public/authors/mmoumni.jpeg'
import mkarimImage from '@/public/authors/mkarim.jpeg'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import './AboutUs.scss'

export default function AboutUs() {
  return (
    <div className="about-us">
      <div className="container">
        <div className="authors">
          <div className="author">
            <div className="content">
              <h2>Youssef BADAOUI</h2>
              <Image
                src={ybadaouiImage}
                width={200}
                height={200}
                alt="Youssef BADAOUI IMAGE"
              />
              <div className="links">
                <div className="linkedin">
                  <Link href="https://www.linkedin.com/in" target='_blank' >
                    <FaLinkedin />
                  </Link>
                </div>
                <div className="github">
                  <Link href="https://github.com/" target='_blank' >
                    <FaGithub />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="author">
            <div className="content">
              <h2>Zakaria RABHI</h2>
              <Image
                src={zrabhiImge}
                width={200}
                height={200}
                alt="Zakaria RABHI IMAGE"
              />
              <div className="links">
                <div className="linkedin">
                  <Link href="https://www.linkedin.com/in" target='_blank' >
                    <FaLinkedin />
                  </Link>
                </div>
                <div className="github">
                  <Link href="https://github.com/" target='_blank' >
                    <FaGithub />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="author">
            <div className="content">
              <h2>Mohamed MOUMNI</h2>
              <Image
                src={mmoumniImage}
                width={200}
                height={200}
                alt="Mohamed MOUMNI IMAGE"
              />
              <div className="links">
                <div className="linkedin">
                  <Link href="https://www.linkedin.com/in" target='_blank' >
                    <FaLinkedin />
                  </Link>
                </div>
                <div className="github">
                  <Link href="https://github.com/" target='_blank' >
                    <FaGithub />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="author">
            <div className="content">
              <h2>Mohamed KARIM</h2>
              <Image
                src={mkarimImage}
                width={200}
                height={200}
                alt="Mohamed KARIM IMAGE"
              />
              <div className="links">
                <div className="linkedin">
                  <Link href="https://www.linkedin.com/in" target='_blank' >
                    <FaLinkedin />
                  </Link>
                </div>
                <div className="github">
                  <Link href="https://github.com/" target='_blank' >
                    <FaGithub />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
