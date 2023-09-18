"use client";

import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import React, { useEffect, useRef, useState } from "react";

import { AiOutlineSetting } from "react-icons/ai";
import { BsThreeDotsVertical, BsFillSendFill } from "react-icons/Bs";

import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";

import "./style.scss";
import axios from "axios";

export default function Chat() {
  const [selectedUserChat, setSelectedUserChat] = useState(null);

  const users = [
    { id: 1, message: "test message 1" },
    { id: 2, message: "test long long long long long 2" },
    { id: 3, message: "test3" },
  ];

  return (
    <div className="logged-user">
      <SideBar />
      <div className="home">
        <div className="chat-page">
          <h2 className="text-2xl text-white mx-auto my-4">
            <strong>Chat</strong>
          </h2>
          <div className="container">
            <ListUsersMessages
              users={users}
              setSelectedUser={setSelectedUserChat}
            />
            {selectedUserChat && <BoxChat user={selectedUserChat} />}
            <Friends />
          </div>
        </div>
      </div>
    </div>
  );
}

const ListUsersMessages = ({ users, setSelectedUser }: any) => {
  const handleClickUserMessage = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <div className="users-container">
      <div className="inbox-header">
        <span className="text-white">inbox</span>
        <AiOutlineSetting />
      </div>
      <div className="mb-4">
        <form>
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="relative">
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-white rounded-3xl bg-[#1F1F1F] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              placeholder="Search..."
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>
        </form>
      </div>
      <div>
        {users.map((user, index): any => {
          return (
            <UserCard
              user={user}
              key={index}
              onClick={() => handleClickUserMessage(user)}
            />
          );
        })}
      </div>
    </div>
  );
};

const UserCard = ({ user, onClick }: any): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className="user-card-container block p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
    >
      <User user={user} />
      <div>{user.message}</div>
    </div>
  );
};

const BoxChat = ({ user }: any): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  const sendMessage = async () => {
    const body = {
      message,
      channelId: 1,
    };
    console.log("body", body);
    try {
      const response = await axios.post("http://127.0.0.1:8080/api/chat", body);
      console.log("response", response);
      setMessage("");
    } catch (error) {
      alert("error");
    }
  };
  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  return (
    <div className="box-chat">
      <div className="box-chat-container">
        <User user={user} />
        <BsThreeDotsVertical />
      </div>
      <div className="box-chat-messages">
        <div className="messages-box flex-grow overflow-y-auto">
          <div className="flex flex-col space-y-2 p-4">
            <div className="self-end bg-blue-500 text-white rounded-lg p-2 flex items-center">
              <span className="material-icons mr-2">person</span>
              <p>This is a sender message</p>
            </div>
            <div className="self-start bg-gray-200 rounded-lg p-2 flex items-center">
              <span className="material-icons mr-2">person</span>
              <p>This is a receiver message</p>
            </div>
            <div className="self-end bg-blue-500 text-white rounded-lg p-2 flex items-center">
              <span className="material-icons mr-2">person</span>
              <p>This is a sender message</p>
            </div>
            <div className="self-start bg-gray-200 rounded-lg p-2 flex items-center">
              <span className="material-icons mr-2">person</span>
              <p>This is a receiver message</p>
            </div>
            <div className="self-end bg-blue-500 text-white rounded-lg p-2 flex items-center">
              <span className="material-icons mr-2">person</span>
              <p>This is a sender message</p>
            </div>
            <div className="self-start bg-gray-200 rounded-lg p-2 flex items-center">
              <span className="material-icons mr-2">person</span>
              <p>This is a receiver message</p>
            </div>
            <div className="self-end bg-blue-500 text-white rounded-lg p-2 flex items-center">
              <span className="material-icons mr-2">person</span>
              <p>This is a sender message</p>
            </div>
            <div className="self-start bg-gray-200 rounded-lg p-2 flex items-center">
              <span className="material-icons mr-2">person</span>
              <p>This is a receiver message</p>
            </div>
            <div className="self-end bg-blue-500 text-white rounded-lg p-2 flex items-center">
              <span className="material-icons mr-2">person</span>
              <p>This is a sender message</p>
            </div>
            <div className="self-start bg-gray-200 rounded-lg p-2 flex items-center">
              <span className="material-icons mr-2">person</span>
              <p>This is a receiver message</p>
            </div>
          </div>
          <div className="p-4 flex items-center w-full">
            <div className="relative w-full">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                <BsFillSendFill color={"white"} onClick={sendMessage} />
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-white rounded-3xl bg-[#1F1F1F] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                placeholder="Write a message"
                onChange={handleChange}
                value={message}
              />
            </div>
          </div>
          <div ref={ref} />
        </div>
      </div>
    </div>
  );
};

const User = ({ user }: any): JSX.Element => {
  return (
    <div className="user-card-content">
      <img
        className="mb-3 rounded-full shadow-lg"
        width={50}
        height={50}
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOWSMigj9Wnxa4KWAspMvvIf6Iho0n8cZCIGFjorPQRA&s"
        alt={user.username}
      />
      <div>
        <div>{user.id}</div>
        <div>in Match making</div>
      </div>
    </div>
  );
};

const Friends = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const [users, setUsers] = useState([{}, {}, {}]);

  useEffect(() => {
    // get friends here
  }, []);

  return (
    <>
      {showSidebar ? (
        <button
          className="flex text-4xl text-white items-center cursor-pointer fixed right-10 top-6 z-50"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          x
        </button>
      ) : (
        <svg
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed  z-30 flex items-center cursor-pointer right-10 top-6"
          fill="#2563EB"
          viewBox="0 0 100 80"
          width="40"
          height="40"
        >
          <rect width="100" height="10"></rect>
          <rect y="30" width="100" height="10"></rect>
          <rect y="60" width="100" height="10"></rect>
        </svg>
      )}

      <div
        className={`top-0 right-0 w-[35vw] bg-blue-600  p-10 pl-20 text-white fixed h-full z-40 ease-in-out duration-300 ${
          showSidebar ? "translate-x-0 " : "translate-x-full"
        }`}
      >
        <h3 className="mt-15 text-2xl font-semibold text-white">Friends</h3>
        <Card className="friends-list">
          <List className="gap-3.5">
            {users.length && 
              users.map(user => (
                (
                  <ListItem className="border-b-2 p-4">
                    <ListItemPrefix>
                      <Avatar
                        variant="circular"
                        alt="candice"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOWSMigj9Wnxa4KWAspMvvIf6Iho0n8cZCIGFjorPQRA&s"
                      />
                    </ListItemPrefix>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        Tania Andrew
                      </Typography>
                      <Typography
                        variant="small"
                        color="gray"
                        className="font-normal"
                      >
                        Software Engineer @ Material Tailwind
                      </Typography>
                    </div>
                  </ListItem>
                )
              ))
            }
          </List>
        </Card>
      </div>
    </>
  );
};
