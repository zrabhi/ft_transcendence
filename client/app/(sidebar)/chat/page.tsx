"use client";

import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import React, { useContext, useEffect, useState } from "react";
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
import { Message, chat } from "@/interfaces/ChatTypes";
import io, { Socket } from "socket.io-client";
import { useCookies } from "react-cookie";
import { socketResponse } from "@/interfaces/socketResponse";
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";
import { AiOutlineKey } from "react-icons/ai";
import { array } from "yup";
import { AuthContext } from "@/app/context/AuthContext";

// when adding notification we must add the  message sended by  the user in last messages
let socket: Socket;
const Chat: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<any>(null); // to set the channel selected
  const [selectedChat, setSelectedChat] = useState<chat>(); // to set the user selected
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<channels[]>([]); // to set channels already exists
  const [otherChannels, setOtherChannels] = useState<channels[]>([]);
  const [users, setUsers] = useState([]); // to set users (TODO : changing it to user friends)
  const { user } = useContext(AuthContext);
  const [cookie] = useCookies(["access_token"]);
  useEffect(() => {
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/users`);
      setUsers(response);
    })();
  }, []);
  // testing socket in root chat page
  // GET all channels already created
  useEffect(() => {
    (async () => {
      // TODO: need to be in one request => /channels
      try {
        const responseDm = await getRequest(`${baseChatUrl}/channelsDm`); // fetching USER Dms
        setChannels(responseDm);
        const responseRooms = await getRequest(`${baseChatUrl}/channelsRooms`); // fetching user rooms
        setChannels((prevchannels: any) => [...prevchannels, ...responseRooms]);
      } catch (error) {}
    })();
    (async () => {
        const reponse = await getRequest(`${baseChatUrl}/getChannels`);
        setOtherChannels(reponse);
    })
    ()
  }, []);
  useEffect(() => {
    socket = io("http://127.0.0.1:8080/chat", {
      auth: {
        token: cookie.access_token,
      },
    });
    socket.on("connected", () => {
      console.log("socket connected");
      socket.on("lastMessage", (messageInfo: any) => {
        let checker = false;
        let updatedChannel: any = channels.filter((channel: any) => {
          if (
            channel?.channel &&
            channel?.channel?.id === messageInfo?.channel?.id
          ) {
            checker = true;
            channel.channel.message = messageInfo?.channel?.message;
            return channel;
          }
        });
        let previousChannels = channels.filter((channel: any) => {
          return (
            channel?.channel && channel?.channel?.id != messageInfo?.channel?.id
          );
        });
        console.log("updated channel", updatedChannel, previousChannels);
        !checker
          ? setChannels((prevChannels: any) => [messageInfo, ...prevChannels])
          : setChannels(() => [...updatedChannel, ...previousChannels]);
      });

      socket.on("channelDeleted", (data: socketResponse) => {
        if (!data.success) {
          alert(data.error);
          return;
        }
        let updatedChannel = channels.map((channel: any) => {
          if (channel.channel && channel.channel.id === data.channelId)
            return [];
          return channel;
        });
        setSelectedChannel(null); // the  the channel here for other usersss
        setChannels(updatedChannel);
      });
      // socket.on("disconnected", () => {
      //   console.log("socket chat disconnected");
      //   // socket.disconnect();
      // })
      socket.on("NewMember", (data: any) => {
        if (data.member === user.username)
          setChannels((prevChannels: any) => [
            data.lastMessage,
            ...prevChannels,
          ]);
        else {
          alert(`${data.member} is now in ${data?.channelName} room`); // replace it with something to show that new user has been added
          let updatedSelectedChannel = selectedChannel
          updatedSelectedChannel?.members.push({
            name: data.member,
            role: data.role,
            status: data.status,
            avatar: data.avatar,
            id: data.id,
          });
          setSelectedChannel(updatedSelectedChannel);
        }
      });
      socket.on("disconnect", () => {
        socket.off("latMessage")
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // TODO :?  --- GET CONNECTED USER FRIENDS
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  // add header bar to work in notification
  return (
    <div className="logged-user">
      <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className="home">
        {/* <HeaderBar /> */}
        <div className="chat-page">
          <h2 className="text-2xl text-white mx-auto my-4">
            <strong>Chat</strong>
          </h2>
          <div className="container">
            <Channels
              setMessages={setMessages}
              channels={channels}
              setSelectedChannel={setSelectedChannel}
              setSelectedChat={setSelectedChat}
            />
            {selectedChannel && (
              <BoxChat
                setSelectedChannel={setSelectedChannel}
                setMessages={setMessages}
                messages={messages}
                channels={channels}
                selectedChannel={selectedChannel}
                selectedChat={selectedChat}
                setChannels={setChannels}
                users={users}
              />
            )}
            {otherChannels && otherChannels.length > 0 && (
              <div className="flex flex-col justify-start items-center">
                <h2 className="text-2xl mx-auto my-4 text-white font-semibold">
                  <strong>channels</strong>
                </h2>
                <div
                  className="flex flex-col mx-4 max-h-600px overflow-y-auto"
                  style={{ width: "350px", maxWidth: "350px", height: "600px" }}
                >
                  {otherChannels.map((channel) => (
                    <div className="w-full p-4" key={channel.id}>
                      <div className="flex items-center content-center justify-between bg-[#050A30] rounded-3xl text-white shadow-lg p-4">
                        <div className="flex items-center relative">
                          <img
                            src={channel.avatar}
                            alt={channel?.name}
                            className="avatar mr-2"
                          />
                          <h3 className="text-lg font-semibold text-center">
                            {channel?.name}
                          </h3>
                        </div>
                        {/* TODO: onclick if its protected a popup will show up to type password */}
                        <button
                          onClick={() => alert("join a channel here")}
                          className="flex justify-between items-center gap-1 bg-[#654795]  text-white font-semibold py-2 px-4 rounded-3xl focus:outline-none"
                        >
                          Join{" "}
                          {channel.type === "PROTECTED" && <AiOutlineKey />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Friends
              setSelectedChannel={setSelectedChannel}
              setSelectedChat={setSelectedChat}
              users={users}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
