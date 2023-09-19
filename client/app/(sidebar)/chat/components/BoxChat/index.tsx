import { baseChatUrl, getRequest, postRequest } from "@/app/context/utils/service";
import { useEffect, useRef, useState } from "react";
import { BsFillSendFill, BsThreeDotsVertical } from "react-icons/Bs";
import { User } from "../UserCard";

const BoxChat = ({ selectedChannel, selectedUser, users }: any): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState({});
  
    useEffect(() => {
      console.log("selected user", selectedChannel);

      setUser(selectedUser);
    }, [selectedChannel]);
  
    useEffect(() => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    },[]);
  
    useEffect(() => {
      (async () => {
        try {
          const response = await getRequest(`${baseChatUrl}/create/dm`); // should get all messages
          setMessages(response);
        } catch (error) {}
      })();
      // get friends here
    }, [selectedChannel]);
  
    const sendMessage = async () => {
      const body = {
        message: message,
        channelId: selectedChannel.id,
      };
      try {
        const response = await postRequest(
          `${baseChatUrl}/saveMessage`,
          JSON.stringify(body)
        );
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
          <BsThreeDotsVertical className='icon cursor-pointer'/>
        </div>
        <div className="box-chat-messages">
          <div className="messages-box flex flex-col flex-grow overflow-y-auto justify-end">
            <div className="flex flex-col space-y-2 p-4">
              {/* TODO: List messages here */}

              {/* <div className="self-end bg-blue-500 text-white rounded-lg p-2 flex items-center">
                <span className="material-icons mr-2">person</span>
                <p>This is a sender message</p>
              </div>
              <div className="self-start bg-gray-200 rounded-lg p-2 flex items-center">
                <span className="material-icons mr-2">person</span>
                <p>This is a receiver message</p>
              </div> */}
              
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