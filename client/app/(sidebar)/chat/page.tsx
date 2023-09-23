"use client";

import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import React, { useEffect, useState } from "react";




import "./style.scss";
import {
  baseChatUrl,
  baseUrlUsers,
  getRequest,
} from "@/app/context/utils/service";
import Channels from "./components/Channels";
import BoxChat from "./components/BoxChat";
import Friends from "./components/Friends";
import { channels } from "@/interfaces/channels";
import { chat } from "@/interfaces/ChatTypes";



const Chat: React.FC = () => {

  const [selectedChannel, setSelectedChannel] = useState<channels>(); // to set the channel selected
  const [selectedChat, setSelectedChat] = useState<chat>(); // to set the user selected
  //TODO:create type for channles already exists
  const [channels, setChannels] = useState<any>([]); // to set channels already exists
  const [users, setUsers] = useState([]); // to set users (TODO : changing it to user friends)
  // GET all users
  useEffect(() => {
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/users`);
      setUsers(response);
    })();
  }, []);

  // GET all channels already created
  useEffect(() => {
    (async () => {
      try {
        const responseDm = await getRequest(`${baseChatUrl}/channelsDm`); // fetching USER Dms
        setChannels(responseDm);
        const responseRooms = await getRequest(`${baseChatUrl}/channelsRooms`); // fetching user rooms
        setChannels((prevchannels: any) => [...prevchannels, ...responseRooms])
      } catch (error) { }
    })();
  }, []);

  // TODO :?  --- GET CONNECTED USER FRIENDS

  return (
    <div className="logged-user">
      <SideBar />
      <div className="home">
        <div className="chat-page">
          <h2 className="text-2xl text-white mx-auto my-4">
            <strong>Chat</strong>
          </h2>
          <div className="container">
            <Channels
              channels={channels}
              setSelectedChannel={setSelectedChannel}
              setSelectedChat={setSelectedChat}
            />
            {selectedChannel && <BoxChat selectedChannel={selectedChannel} selectedChat={selectedChat} setChannels={setChannels} users={users} />}
            <Friends setSelectedChannel={setSelectedChannel} setSelectedChat={setSelectedChat} users={users} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
