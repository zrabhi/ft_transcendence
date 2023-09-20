import { AiOutlineSetting } from "react-icons/ai";

import UserCard from "../UserCard"
import { BsSearch } from "react-icons/Bs";
import { baseChatUrl, postRequest } from "@/app/context/utils/service";

const Channels = ({ channels, setSelectedUser,setSelectedChannel}: any) => {
    const handleClickUserMessage = async (user: any) => {
      const response = await postRequest(
        `${baseChatUrl}/create/dm`,
        JSON.stringify({ username: user.username, memberLimit: 2 })
      );
      setSelectedChannel(response);
      setSelectedUser(user);
      console.log("userrr ",user);
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
              <div className="absolute text-white inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <BsSearch />
              </div>
            </div>
          </form>
        </div>
        <div>
          {channels.length > 0 && channels?.map((channel: any, index: Number) => {
            return (
              <UserCard
                user={channel}
                key={index}
                onClick={() => handleClickUserMessage(channel)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  export default Channels;