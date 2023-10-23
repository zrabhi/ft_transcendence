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
import Image from 'next/image';
import { showSnackbar } from '@/app/context/utils/showSnackBar';

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
    const [checker, setChecker] = useState(false);
    const [opp_username, setoppuser] = useState('opponent');
    const [opponentUser, setOpponentUser] = useState<any>();
    const [opp_avatar, setOpponentavatar] = useState<string>("https://cdn.dribbble.com/users/886358/screenshots/2980235/loading.gif")
    const [myscore, setmyscore] = useState(0);
    const [oppscore, setoppscore] = useState(0);
    const [status, setstatus] = useState("default status")
    const handleNewGameClick = (e: any) => {
      e.preventDefault();
      window.location.href ="/game/match";
      setShowPopup(false);
    };
    
    const handleBackHomeClick = (e: any) => {
      e.preventDefault();

      window.location.href ="/profile";
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
        game = true;
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
  
    useEffect(() =>{
      try{
        (async () =>{
          const response = await getRequest(`${baseUrlUsers}/userStatus`)
          if (response?.error)
          {
            if (response?.message === "Unauthorized")
            {
              showSnackbar("Unauthorized", false)
            }
            else
              showSnackbar("Something went wrong", false);
            return;
          } 
          setstatus(response);
          setChecker(true);
        })()
      }catch(e)
      {
        showSnackbar("somthing went wrong", false);
        window.location.href ="/game";
      }
    },[])

    useEffect(() => {
      try{
      selectedcolor = localStorage.getItem("selectedMapColor") as string;
      if(checker)
      {
      if (status === "INGAME")
      {
          showSnackbar("already in game", false);
          window.location.href ="/game";
          return;
      }
      socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/matching`,{
        auth: {
          token: cookie.access_token,
        }});

     
        socket.on('connect', () => {
          socket.on('disconnect',()=>{
            router.push('/game')
          })

        socket.on('matched right',  (data:any) => {
          setoppuser(data.username);
          setOpponentavatar(data.avatar);
          side = 'right';
          launchGame();
        })
        socket.on('matched left', (data:any) => {
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
    }
    }catch(e){
      showSnackbar("somthing went wrong", false);
      window.location.href ="/game";
    }
    }, [checker]);

    return (
    <div className="logged-user">
    {/* <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} /> */}
    <div className={`game ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
        <div className="game-content p-8">
            <HeaderBar />
            <div className={`core flex w-full`} >
                <div className="score flex p-2 justify-between items-center gap-4">
                  <div className="player1 flex items-center gap-3 w-1/2 justify-between ">
                    <div className="avatar w-12 h-12 rounded-full overflow-hidden border border-slate-50">
                      <Image 
                        src={user?.avatar}
                        alt="avatar"
                        width={100}
                        height={100}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className="username text-sm font-bold tracking-wide hidden md:block uppercase">
                      {user.username}
                    </div>
                    <div className="player-score text-xl">
                      {myscore}
                    </div>
                  </div>
                  <div className="player2 flex flex-row-reverse  items-center justify-between gap-3 w-1/2">
                    <div className="avatar w-12 h-12 rounded-full overflow-hidden border border-slate-50">
                      <Image 
                        src={opp_avatar}
                        alt="avatar"
                        width={100}
                        height={100}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className="username text-sm font-bold tracking-wide hidden md:block uppercase">
                      {opp_username}
                    </div>
                    <div className="player-score text-xl">
                      {oppscore}
                    </div>
                  </div>
                </div>
                
                <div className={`popup ${showPopup ?  'bg-black-400 bg-opacity-70 backdrop-blur-sm': 'hidden' } w-screen h-screen fixed inset-0 flex justify-center items-center `} >|
                  <div className='popupcore w-[50rem] xs:w-[18rem] sm:w-[24rem] md:w-[30rem]
                    rounded-xl  relative p-4 pt-12 pb-8'>
                    <div className="message">{popupMessage}</div>
                    <div className="buttons">
                      <button className={'back'} onClick={(e)=>handleNewGameClick(e)}>New Game</button>
                      <button className={'refreche'} onClick={(e)=>handleBackHomeClick(e)}>Profile</button>
                    </div>
                  </div>
                </div>    
                <div className="table" id='table'>
                    <canvas id="canvas" width={1000} height={600}></canvas>
                </div>
                <div className="back">
                  <button onClick={()=>router.push("/game")}>BACK</button>
                </div>
            </div>
        </div>
    </div>
    
</div>
)
}