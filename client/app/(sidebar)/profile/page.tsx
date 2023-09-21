"use client";
import { useContext, useEffect, useState } from "react";
import "./style.scss";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import ProfileCard from "@/components/LoggedUser/Profile/ProfileCard/ProfileCard";
import { AuthContext } from '@/app/context/AuthContext'
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";
import Achievement from "@/interfaces/Achievement";
import UserStatistics from "@/interfaces/UserStatistics";
import AchievementItem from "@/components/LoggedUser/Profile/Achievement/AchievementItem";
import GameData from "@/components/LoggedUser/Profile/GameData/GameData";
import Statistics from "@/components/LoggedUser/Profile/Statistics/Statistics";
import Leaderboard from "@/components/LoggedUser/Profile/Leaderboard/Leaderboard";
import { baseUrlUsers, getRequest } from "@/app/context/utils/service";
import { GameHistory } from "@/interfaces/GameHistory";
import { Friends } from "@/interfaces/Friends";
import { FaUserFriends, FaHistory, FaListOl } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { GiAchievement } from "react-icons/gi";

export default function Profile() {
  const { getUserData, user } = useContext(AuthContext);

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics[]>([]);
  const [gameHistory, setGamesHistory] = useState<GameHistory[]>([])
  const [FriendsList, setFriendsList] = useState<Friends[]>([]);

  // ZAC here you will fetch the data from the server and set it in state
  const fetchAchievements = async () =>
  {
    const userAchievements = await getRequest(`${baseUrlUsers}/user/achievement`);
    setAchievements(userAchievements);
  }

  const fetchFriends = async () =>
  {
    const Friends = await getRequest(`${baseUrlUsers}/user/friends`);
    setFriendsList(Friends);


  }
  const fetchGamesHistory = async () => {
    const userGamesHistory = await getRequest(`${baseUrlUsers}/user/matches`);
    // console.log("history ", userGamesHistory);
    setGamesHistory(userGamesHistory);
  }
  useEffect( () =>
  {
    (async () => {
      /// if there is no achievement the return is null
          await fetchAchievements();
      /// If there is no gameHistory the return is an empty array
          await fetchGamesHistory();
          // if there is no friends the return is an empty arraye
          await fetchFriends();
    })()
  },[])

  const userStatistics = {
    totalWins: 50,
    totalLosses: 20,
    winRate: 71.43,
    ladderRank: 3,
    achievements: [
      {
        key: 'A',
        name: 'First Victory',
        description: 'Win your first game.',
      },
      {
        name: 'Unbeatable',
        description: 'Win 10 games in a row.',
      },
      {
        name: 'Pong Champion',
        description: 'Win 20 games in a row.',
      },
      {
        name: 'Perfect Defense',
        description: 'Win a 10 games in a row without losing a single point.',
      },
      {
        name: 'Master Gamer',
        description: 'Reach level 50 in your favorite game.',
      },
      {
        name: 'Champion of the Arena',
        description: 'Win 100 matches in a row.',
      }
    ],
  };

  // ZAC fetch all the games have been played by the user
  // RECENT BOX i will display last 3 games
  // GAMES HISTORY i will display all the games have been played by the user 
  const recentGames = [
    {
      against: 'mike',
      result: 'win',
    },
    {
      against: 'two',
      result: 'win',
    },
    {
      against: 'three',
      result: 'loss',
    },
    {
      against: 'four',
      result: 'loss',
    },
  ];


  // here we can add timestamps / duration of the game ...
  const gamesHistory = [
    {
      winner: 'you',
      loser: 'mike',
      gameType: '1v1',
      gameMode: 'classic',
      gameResult: 'win',
      winner_score: 10,
      loser_score: 5,
    },
    {
      winner: 'you',
      loser: 'two',
      gameType: '1v1',
      gameMode: 'classic',
      gameResult: 'win',
      winner_score: 10,
      loser_score: 5,
    },
    {
      winner: 'three',
      loser: 'you',
      gameType: '1v1',
      gameMode: 'classic',
      gameResult: 'loss',
      winner_score: 15,
      loser_score: 10,
    },
    {
      winner: 'four',
      loser: 'you',
      gameType: '1v1',
      gameMode: 'classic',
      gameResult: 'loss',
      winner_score: 15,
      loser_score: 10,
    },
  ];

  const [activeItem, setActiveItem] = useState<number | null>(0); // Initialize with the first item as active (index 0)

  const handleItemClick = (index: number) => {
    setActiveItem(index);
  };

  const menuItems = [
    { icon: <FaUserFriends />, text: 'Friends' },
    { icon: <FaHistory />, text: 'History' },
    { icon: <FaListOl />, text: 'Leaderboard' },
    { icon: <ImStatsBars />, text: 'Statistics' },
    { icon: <GiAchievement />, text: 'Achievements' },
  ];

  return (
    <div className="profile-page text-white">
      <SideBar />
      <div className="profile">
        <div className="profile-content">
          <HeaderBar />
          <ProfileCard data={user} />
          <div className="profile-boxes">
            <div className="navbar-boxes">
              <ul>
                {menuItems.map((item, index) => (
                  <li className={`list ${activeItem === index ? 'active' : ''}`} key={index} onClick={() => handleItemClick(index)}>
                    <a href="#">
                      <span className="icon">{item.icon}</span>
                      <span className="text">{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
