'use client';
import HeaderBar from '@/components/LoggedUser/Profile/HeaderBar/HeaderBar';
import SideBar from '@/components/LoggedUser/SideBar/SideBar'
import exp from 'constants';
import React from 'react'
import './style.scss'
import Avatar1 from '@/public/images/avatar1.jpeg'
import { useEffect, useState} from "react";
import { Socket } from "socket.io";

export default function match()
{
    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
    const io = require("socket.io-client");
    let selectedcolor = 'black';
    let socket: Socket;

    const [myscore, setmyscore] = useState(0);
    const [oppscore, setoppscore] = useState(0);
  
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
      width: 10,
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
      ctx.fillStyle = "white";
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
  
      ctx.fillRect(rightbar.x, rightbar.starty, rightbar.width, rightbar.length);
      ctx.fillRect(leftbar.x, leftbar.starty, leftbar.width, leftbar.length);
    };
  
    const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        selectedcolor ? ctx.fillStyle = selectedcolor : true;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(canvas.width / 2 - 2, 0, 4, canvas.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.stroke();
      drawbars(canvas, ctx);
      if (drawBall(canvas, ctx))
        raf = window.requestAnimationFrame(() => draw(canvas, ctx));
      // else {
      //   game = false;
      //   let text = "YOU LOSE!";
      //   ctx.font = "48px serif";
      //   let textwidth = ctx.measureText(text).width;
      //   let textheight = 48;
      //   ctx.fillStyle = "black";
      //   ctx.fillRect(0, 0, canvas.width, canvas.height);
      //   ctx.fillStyle = "#ffffff";
      //   ctx.fillText(text, (canvas.width - textwidth) / 2, (canvas.height - textheight) / 2);
      // }
    };
  
    const launchGame = () => {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      leftbar.x = 100;
      rightbar.x = canvas.width - 50 - rightbar.width;
      if (game == false) {
        Ball.addx = Ball.addx;
        console.log(game);
        game = true;
        console.log("here we init")
        socket.emit('init', 
        {
          canvasw:canvas.width,
          canvash:canvas.height
        })
        draw(canvas, ctx);
      }
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
      // const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      // const ctx = canvas.getContext("2d") as any;

      // ctx.font = "18px 'Press Start 2P'";
      // let text = "WAITING FOR AN OTHER USER TO JOIN";
      // let textwidth = ctx.measureText(text).width;
      // let textheight = 48;
      // // ctx.fillStyle = selectedcolor;
      // // ctx.fillRect(0, 0, canvas.width, canvas.height);
      // ctx.fillStyle = "white";
      // ctx.fillText(text, (canvas.width - textwidth) / 2, canvas.height  / 5);

      socket = io('http://127.0.0.1:8080/matching');
      socket.on('connect', () => {
        console.log('Connected to WebSocket');
      });
      socket.on('matched right', (data:any) => {
        console.log("i match this : " , data);
        opponent = data;
        side = 'right';
        launchGame(); 
      })
      socket.on('matched left', (data:any) => {
        console.log("i match this : " , data);
        opponent = data;
        side = 'left';
        launchGame(); 
      })
      
      socket.on('match frame',(data:any)=>{
        Ball.x = data.ballx;
        Ball.y = data.bally;
        setmyscore(data.myscore);
        setoppscore(data.oppscore);
        console.log(Ball)
        if(side == 'left')
        {
          rightbar.starty = data.oppy;
        }
        else{
          leftbar.starty = data.oppy;
        }
      })
    }, []);
    return (
    <div className="logged-user">
    <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
    <div className={`game ${isExpanded ? 'ml-12 md:ml-16': ''}`}>
        <div className="game-content min-h-screen p-8">
            <HeaderBar />
            <div className="core min-h-screen flex">
                <div className="score flex">
                    <div className="player player1">
                        <div className='avatar'>
                            <img src="/images/avatar1"  alt="avatar" />
                        </div>
                        <div>PLAYER1</div>
                        <div className="score1">9</div>
                    </div>
                    <div className="player player2">
                        <div className="score2">8</div>
                        <div>PLAYER2</div>
                        <div className='avatar'>
                            <img src="/images/avatar1" alt="avatar" />
                        </div>
                    </div>
                </div>
                <div className="table">
                    <canvas id="canvas" width={1000} height={600}></canvas>
                </div>
            </div>         
        </div>
    </div>
</div>
)
}