import {
  baseChatUrl,
  getRequest,
  getRequestBody,
  postRequest,
} from "@/app/context/utils/service";
import { useContext, useEffect, useRef, useState } from "react";
import { BsFillSendFill, BsThreeDotsVertical } from "react-icons/Bs";
import { User } from "../UserCard";
import io, { Socket } from "socket.io-client";
import { useCookies } from "react-cookie";
import { Message } from "@/interfaces/ChatTypes";
import { AuthContext } from "@/app/context/AuthContext";
import Image from "next/image";

let socket: Socket;
const BoxChat = ({ selectedChannel, selectedChat }: any): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState({});
  const [cookie, setCookie, remove] = useCookies(["access_token"]);
  const { user } = useContext(AuthContext);
  // trying to create socket to connect with other user here
  useEffect(() => {
    (async () => {
      const response = await getRequest(
        `${baseChatUrl}/getMessages/${selectedChannel.id}`
      );
      setMessages(() => []);
      setMessages((prevMessages) => [...prevMessages, ...response]); //reminderr
      console.log("chat ", selectedChat);
    })();

    setChat(selectedChat);
    socket = io("http://127.0.0.1:8080/chat", {
      auth: {
        token: cookie.access_token,
      },
    });
    socket.on("connected", () => {
      console.table("connected");
      socket.emit("joinChat", { id: selectedChannel.id });

      socket.on("message", (messageInfo: Message) => {
        let sendedMessage: Message = {
          content: messageInfo.content,
        };
        if (user.username != messageInfo.reciever) {
          sendedMessage.sender = messageInfo.reciever;
          sendedMessage.avatar = messageInfo.avatar;
        } else sendedMessage = messageInfo;
        setMessages((prevMessages) => [...prevMessages, sendedMessage]);
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [selectedChannel]);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  //   // get friends here

  const sendMessage = async () => {
    const body = {
      message: message,
      channelId: selectedChannel.id,
      token: cookie.access_token,
    };

    socket.emit("message", body);
  };

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  return (
    <div className="box-chat">
      <div className="box-chat-container">
        <User user={chat} />
        <BsThreeDotsVertical className="icon cursor-pointer" />
      </div>
      <div className="box-chat-messages">
        <div className="messages-box flex flex-col flex-grow overflow-y-auto justify-end">
          <div className="flex flex-col space-y-2 p-4">
            {
              /* TODO: List messages here */
              //DONE
            }
            {messages &&
              messages?.map((message, index) =>
                message.reciever ? (
                  <div
                    className="self-end bg-blue-500 text-white rounded-lg p-2 flex items-center"
                    key={index}
                  >
                    <span className="material-icons mr-2">
                      <Image alt={message.reciever} src={message.avatar} width={50} height={50} />
                    </span>
                    <p>{message.content}</p>
                  </div>
                ) : (
                  <div
                    className="self-start bg-gray-200 rounded-lg p-2 flex items-center"
                    key={index}
                  >
                    <span className="material-icons mr-2">
                      <Image alt={message.sender} src={message.avatar} width={50} height={50} />
                    </span>
                    <p>{message.content}</p>
                  </div>
                )
              )}
          </div>
          <div className="p-4 w-full flex justify-end">
            <div className="relative w-full">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                <BsFillSendFill color={"white"} onClick={sendMessage} />
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-white rounded-3xl bg-[#1F1F1F] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

export default BoxChat;
