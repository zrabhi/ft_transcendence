// import React from 'react'
// import { useState, useEffect } from 'react';
// import { FaUserFriends, FaHistory, FaListOl } from "react-icons/fa";
// import { ImStatsBars } from "react-icons/im";
// import { GiAchievement } from "react-icons/gi";

export default function UserProfile({ username }: { username: string }) {
  // const [activeItem, setActiveItem] = useState<number>(2);
  // const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // useEffect(() => {
  //   const listItemWidth = 100 / menuItems.length;
  //   const left = `calc(${listItemWidth * activeItem}% + ${listItemWidth / 2}%)`;
  //   const indicator = document.querySelector('.indicator') as HTMLElement;
  //   if (indicator) {
  //     indicator.style.left = left;
  //   }
  // }, [activeItem]);

  // const handleItemClick = (index: number) => {
  //   setActiveItem(index);
  // };

  // const menuItems = [
  //   { icon: <FaUserFriends />, text: 'Friends' },
  //   { icon: <FaHistory />, text: 'History' },
  //   { icon: <FaListOl />, text: 'Leaderboard' },
  //   { icon: <ImStatsBars />, text: 'Statistics' },
  //   { icon: <GiAchievement />, text: 'Achievements' },
  // ];

  return (
    <div className='text-slate-50'>
      UserProfile
      <h1>{username}</h1>
    </div>
  )
}
