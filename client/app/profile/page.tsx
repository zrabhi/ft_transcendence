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

export default function Profile() {
  const { getUserData, user } = useContext(AuthContext);

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics[]>([]);

  // ZAC here you will fetch the data from the server and set it in state
  // useEffect(() => {
  //   // Fetch user achievements and set them in state
  //   const fetchAchievements = async () => {
  //     try {
  //       const userAchievements = await fetchUserAchievements(user.data.id);
  //       setAchievements(userAchievements);
  //     } catch (error) {
  //       // Handle errors
  //     }
  //   };
  //   // Fetch user games history and set it in state
  //   const fetchGamesHistory = async () => {
  //     try {
  //       const userGamesHistory = await fetchUserGamesHistory(user.data.id);
  //       setGamesHistory(userGamesHistory);
  //     } catch (error) {
  //       // Handle errors
  //     }
  //   };

  //   // Call the functions to fetch data when user data is available
  //   if (user) {
  //     fetchAchievements();
  //     fetchGamesHistory();
  //   }
  // }, [user]); // Only run when 'user' changes

  // examples for test
  const userStatistics = {
    totalWins: 50,
    totalLosses: 20,
    winRate: 71.43,
    ladderRank: 3,
    achievements: [
      {
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

  return (
    <div className="profile-page text-white">
      <SideBar />
      <div className="profile">
        <div className="profile-content">
          <HeaderBar />
          <ProfileCard data={user} />
          <div className="profile-boxes">
            <div className="box recent-activities">
              <h4>
                recent activities
              </h4>
              <div className="recent-games">
                {
                  recentGames.slice(0, 3).map((game, index) => (
                    <div key={index} className=''>
                      {game.result} the game against {game.against}
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="box achievements">
              <h4>Achievements</h4>
              <ul>
                {userStatistics.achievements.map((achievement, index) => (
                  <li key={index}>
                    <AchievementItem achievement={achievement} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="box statistics">
              <h4>
                statistics
              </h4>
              <Statistics />
              {/* NUMBER OF WINS AND LOSES A GAMES HAVE BEEN PLAYED BY THE USER  */}
            </div>
            <div className="box games-history">
              <h4>
                games history
              </h4>
              {/* INCLUDE 1V1 GAMES THAT HAVE BEEN PLAYED BY THE USER */}
              <div className="games">
                {
                  gamesHistory.map((game, index) => (
                    <GameData key={index} game={game} />
                  )
                )}
              </div>
            </div>
            <div className="box friends">
              <h4>
                friends
              </h4>
              {/* LIST OF FRIENDS */}
            </div>
            <div className="box leaderboard">
              <h4>
                leaderboard
              </h4>
              {/* LIST OF USERS WITH THE HIGHEST WIN GAMES */}
              {/* <Leaderboard /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
