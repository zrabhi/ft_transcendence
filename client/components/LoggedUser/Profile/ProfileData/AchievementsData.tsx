import React from 'react'
import Image from 'next/image'
import Achive1Avatar from "@/public/achievements/account-creation.jpeg"
import Achive2Avatar from "@/public/achievements/first-friend.png"
import Achive3Avatar from "@/public/achievements/first-game.png"
import Achive4Avatar from "@/public/achievements/first-lose.png"
import Achive5Avatar from "@/public/achievements/first-win.png"
import Achive6Avatar from "@/public/achievements/clean-sheet.png"

export default function AchievementsData({achievements}: any) {

  let achievsDataArr = [
    {
      "key" : "accountCreationAchie",
      "name" : "Account Creation",
      "description" : "You have created your account",
      avatarName : Achive1Avatar,
    },
    {
      "key" : "firstFriendAchie",
      "name" : "First Friend",
      "description" : "You have added your first friend",
      avatarName : Achive2Avatar,
    },
    {
      "key" : "firstGameAchie",
      "name" : "First Game",
      "description" : "You have played your first game",
      avatarName : Achive3Avatar,
    },
    {
      "key" : "firstLoseAchie",
      "name" : "First Lose",
      "description" : "You have lost your first game",
      avatarName : Achive4Avatar,
    },
    {
      "key" : "firstWinAchie",
      "name" : "First Win",
      "description" : "You have won your first game",
      avatarName : Achive5Avatar,
    },
    {
      "key" : "cleanSheetGameAchie",
      "name" : "Clean Sheet",
      "description" : "You have won a game without losing any life",
      avatarName : Achive6Avatar,
    }
  ]

  return (
    <div className="achievs mt-4 flex flex-col gap-1">
      {achievsDataArr.map((achiev, index) => {
        const isAchieved = achievements[achiev.key];
        if (!isAchieved)
          return ;
        return (
          <div className="achiev flex gap-8 p-8 cursor-pointer rounded-[.3rem] items-center bg-purple-400 bg-opacity-10 hover:bg-opacity-40 transition-all duration-100" key={index}>
            <div className="achiev__avatar">
              <Image 
                src={achiev.avatarName} 
                alt={`Achievement ${achiev.name}`} 
                width={50} 
                height={50} />
            </div>
            <div className="achiev-text">
              <div className="achiev_name font-bold text-xl tracking-wider ">{achiev.name}</div>
              <div className="achiev_description opacity-60">{achiev.description}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
