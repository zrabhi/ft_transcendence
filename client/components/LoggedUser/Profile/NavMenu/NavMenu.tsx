import React from 'react'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaUserFriends, FaHistory, FaListOl } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { GiAchievement } from "react-icons/gi";
import './NavMenu.scss'

export default function NavMenu() {
  const [activeItem, setActiveItem] = useState<number>(2);

  const menuItems = [
    { icon: <FaUserFriends />, text: 'Friends' },
    { icon: <FaHistory />, text: 'History' },
    { icon: <FaListOl />, text: 'Leaderboard' },
    { icon: <ImStatsBars />, text: 'Statistics' },
    { icon: <GiAchievement />, text: 'Achievements' },
  ];

  useEffect(() => {
    const listItemWidth = 100 / menuItems.length;
    const left = `calc(${listItemWidth * activeItem}% + ${listItemWidth / 2}%)`;
    const indicator = document.querySelector('.indicator') as HTMLElement;
    if (indicator) {
      indicator.style.left = left;
    }
  }, [activeItem]);

  const handleItemClick = (index: number) => {
    setActiveItem(index);
  };

  return (
    <div>
      <div className="nav-menu px-4 py-0 relative">
        <ul className='relative flex justify-center items-center h-16'>
          {menuItems.map((item, index) => (
            <li className={`list ${activeItem === index ? 'active' : ''} 
              relative h-16 w-1/5 
            `} 
            key={index} onClick={() => handleItemClick(index)}>
              <Link href="">
                <span className="icon">{item.icon}</span>
                <span className="text">{item.text}</span>
              </Link>
            </li>
          ))}
          <div className="indicator absolute left-1/2">
          </div>
        </ul>
      </div>
    </div>
  )
}
