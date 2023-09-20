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



const Chat: React.FC = () => {

  const [selectedChannel, setSelectedChannel] = useState(null); // to set the channel selected
  const [selectedUser, setSelectedUser] = useState({}); // to set the user selected
  const [channels, setChannels] = useState([]); // to set channels already exists
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
        const response = await getRequest(`${baseChatUrl}/channels`);
        console.log(response);
        setChannels(response);
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
              setSelectedUser={setSelectedUser}
              users={users}
            />
            {selectedChannel && <BoxChat selectedChannel={selectedChannel} selectedUser={selectedUser} setChannels={setChannels} users={users} />}
            <Friends setSelectedChannel={setSelectedChannel} setSelectedUser={setSelectedUser} users={users} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
