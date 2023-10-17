'use client';
import HeaderBar from '@/components/LoggedUser/Profile/HeaderBar/HeaderBar';
import SideBar from '@/components/LoggedUser/SideBar/SideBar'
import exp from 'constants';
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation';
import './style.scss'
import Avatar1 from '@/public/images/avatar1.jpeg'
import { useEffect, useState} from "react";
import { Socket } from "socket.io";
import { AuthContext } from '@/app/context/AuthContext';
import { useCookies } from "react-cookie";
import { baseUrlUsers, getRequest } from '@/app/context/utils/service';
import { disconnect } from 'process';

export default function match()
{
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const [cookie] = useCookies(["access_token"]);
    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
    const {user} = useContext(AuthContext);
    const io = require("socket.io-client");
    let selectedcolor = 'black';
    let socket: Socket;
    let count = 0;

    const [opp_username, setoppuser] = useState('opponent');
    const [opponentUser, setOpponentUser] = useState<any>();
    const [opp_avatar, setOpponentavatar] = useState<string>()
    const [myscore, setmyscore] = useState(0);
    const [oppscore, setoppscore] = useState(0);
    const handleNewGameClick = () => {
      // Redirect to the game match page
      router.push('/game');
      setShowPopup(false);
    };
  
    const handleBackHomeClick = () => {
      // Redirect to the profile page
      router.push('/profile');
      setShowPopup(false);
    };
  

    let raf: number;
    let upkey = false;
    let downkey = false;
    let game = false;
    let side: string;
    let opponent : string;
    const Ball = {
      x: 200,
      y: 100,
      addx: 2,
      addy: 2,
      width: 12,
    };
  
    const leftbar = {
      x: 0,
      starty: 0,
      length: 100,
      width: 15,
    };
  
    const rightbar = {
      x: 100,
      starty: 20,
      length: 100,
      width: 15,
    };
  
    const drawBall = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(Ball.x, Ball.y, Ball.width, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      return 1;
    }; 
  
    const drawbars = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      if(side == 'right')
      {
        if (upkey && rightbar.starty + 5 > 0)
        rightbar.starty -= 5;
      else if (downkey && rightbar.starty + rightbar.length + 5 < canvas.height)
      rightbar.starty += 5;
        socket.emit('bar',rightbar.starty)
      }
      else {
        if (upkey && leftbar.starty + 5 > 0)
          leftbar.starty -= 5;
      else if (downkey && leftbar.starty + leftbar.length + 5 < canvas.height)
        leftbar.starty += 5;
      socket.emit('bar',leftbar.starty)
  }
  
      ctx.fillStyle = "white";
      ctx.fillRect(rightbar.x, rightbar.starty, rightbar.width, rightbar.length);
      ctx.fillRect(leftbar.x, leftbar.starty, leftbar.width, leftbar.length);
    };
  
    const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      selectedcolor ? ctx.fillStyle = selectedcolor : true;
      count++;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(canvas.width / 2 - 2, 0, 4, canvas.height);
      drawbars(canvas, ctx);
      drawBall(canvas, ctx);
      if(game)
        raf = window.requestAnimationFrame(() => draw(canvas, ctx));
      else
      {
        console.log('here we stop drawing');
        ctx?.clearRect(0,0,canvas.width, canvas.height);
      }
    };

    const launchGame =  () => {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      leftbar.x = 100;
      rightbar.x = canvas.width - 100 - rightbar.width;
      if(game == false) {
        Ball.addx = Ball.addx;
        console.log(game);
        game = true;
        console.log("here we init")
        socket.emit('init',
        {
          canvasw:canvas.width,
          canvash:canvas.height
        })
        socket.on('start', ()=>
        {
          draw(canvas, ctx!);
        })
        socket.on('opponent quit',()=>{
          game = false;
          setPopupMessage('Opponent Quit');
          setShowPopup(true);
          const tableElement = document.getElementById('canvas');
          if (tableElement) {
            tableElement.style.backgroundImage = 'url("https://superposition-lyon.com/wp-content/uploads/2023/01/game-over-blanc.jpeg")'
            tableElement.style.backgroundPosition = "center center";
            tableElement.style.backgroundColor = "black";
            tableElement.style.backgroundRepeat= "no-repeat";
          }
        })
      }
      socket.on('right win', () => {
        game = false;
        setPopupMessage('Right Player Wins');
        setShowPopup(true);
        const tableElement = document.getElementById('canvas');
          if (tableElement) {
            tableElement.style.backgroundImage = 'url("https://superposition-lyon.com/wp-content/uploads/2023/01/game-over-blanc.jpeg")'
            tableElement.style.backgroundPosition = "center center";
            tableElement.style.backgroundColor = "black";
            tableElement.style.backgroundRepeat= "no-repeat";
          }
      })
      socket.on('left win', () => {
        setPopupMessage('Left Player Wins');
        setShowPopup(true);
        game = false;
        const tableElement = document.getElementById('canvas');
          if (tableElement) {
            tableElement.style.backgroundImage = 'url("https://superposition-lyon.com/wp-content/uploads/2023/01/game-over-blanc.jpeg")'
            tableElement.style.backgroundPosition = "center center";
            tableElement.style.backgroundColor = "black";
            tableElement.style.backgroundRepeat= "no-repeat";
          }
      })
      window.addEventListener("keydown", (e) => {
        if (e.key == "ArrowUp") upkey = true;
        else if (e.key == "ArrowDown") downkey = true;
      });
  
      window.addEventListener("keyup", (e) => {
        if (e.key == "ArrowUp") upkey = false;
        else if (e.key == "ArrowDown") downkey = false;
      });
    };
  
    useEffect(() => {
      selectedcolor = localStorage.getItem("selectedMapColor") as string;
      socket = io('http://127.0.0.1:8080/matching',{
        auth: {
          token: cookie.access_token,
        }});
      socket.on('connect', () => {
        console.log('Connected to WebSocket');
        socket.on('disconnect',()=>{
          router.push('/game')
        })
        socket.on('matched right',  (data:any) => {
          console.log("i match this : " , data);
          setoppuser(data.username);
          setOpponentavatar(data.avatar);
          side = 'right';
          launchGame();
        })
        socket.on('matched left', (data:any) => {
          console.log("i match this : " , data);
          setoppuser(data.username);
          setOpponentavatar(data.avatar);
          side = 'left';
          launchGame();
        })
  
        socket.on('match frame',(data:any)=>{
          Ball.x = data.ballx;
          Ball.y = data.bally;
          setmyscore(data.myscore);
          setoppscore(data.oppscore);
  
          if (side == 'left')
          {
            rightbar.starty = data.oppy;
          }
          else{
            leftbar.starty = data.oppy;
          }
        });
        // socket.on("disconnect", () => {
        //   socket.off('matched right');
        //   socket.off('matched left');
        //   socket.off('match frame');
        // });
      });
      return () => {
        socket.disconnect()
      }
    }, []);

    return (
    <div className="logged-user">
    <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
    <div className={`game ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
        <div className="game-content min-h-screen p-8">
            <HeaderBar />
            <div className={`core flex w-full`} >
                <div className="score flex">
                    <div className="player player1">
                        <div className='avatar'>
                            <img src={user?.avatar}  alt="avatar" />
                        </div>
                        <div className='player-name invisible lg:visible ' >{user.username}</div>
                        <div className="score1">{myscore}</div>
                    </div>
                    <div className="player player2">
                        <div className="score2">{oppscore}</div>
                        <div className='player-name invisible lg:visible ' >{opp_username}</div>
                        <div className='avatar'>
                            <img src={opp_avatar} alt="avatar" />
                        </div>
                    </div>
                </div>
                <div className={`popup ${showPopup ?  'bg-black-400 bg-opacity-70 backdrop-blur-sm': 'hidden' } w-screen h-screen fixed inset-0 flex justify-center items-center `} >|
                  <div className='popupcore w-[50rem] xs:w-[18rem] sm:w-[24rem] md:w-[30rem]
         rounded-xl  relative p-4 pt-12 pb-8'>
                    <div className="message">hna radi ykon pop up message{popupMessage}</div>
                    <div className="buttons">
                      <button className={'back'} onClick={handleNewGameClick}>New Game</button>
                      <button className={'refreche'} onClick={handleBackHomeClick}>Back Home</button>
                    </div>
                  </div>
                </div>    
                <div className="table" id='table'>
                    <canvas id="canvas" width={1000} height={600}></canvas>
                </div>
            </div>
        </div>
    </div>
    
</div>
)
}