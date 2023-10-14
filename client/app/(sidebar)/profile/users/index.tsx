import { baseChatUrl, postRequest } from "@/app/context/utils/service";
import { Key, useContext, useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";

import { AiOutlineMessage } from "react-icons/ai";
import { GiPingPongBat } from "react-icons/gi";
import { BiUserCheck } from "react-icons/bi";
import {FaUsersLine } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { showSnackbar } from "@/app/context/utils/showSnackBar";

const Users = ({ userFriends, users }: any) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { blockedUsers, userBlockedMe } = useContext(AuthContext);
let test: any = [];
  const router = useRouter();
  const handleRedirectProfile = (user: any) => {
    router.push(`/profile/${user?.username}`);
  };
  const checkBlocked = (user: any) => {
    return (
      blockedUsers.some((friend: any) => friend === user.username) ||
      userBlockedMe.some((friend: any) => friend === user.username)
    );
  };
  useEffect(() => {
    console.log("blocked user ++++", blockedUsers);
  }, [blockedUsers]);
  return (
    <>
      {showSidebar ? (
        <button
          className="flex text-4xl text-white items-center cursor-pointer fixed right-10 top-10 z-50"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          x
        </button>
      ) : (
        <FaUsersLine 
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed  z-30 flex items-center cursor-pointer right-10 top-17 text-white icon text-3xl"
        />
      )}

      <div
        className={`users-bar top-0 right-0  p-10 pl-20 text-white fixed h-full z-40 ease-in-out duration-300 ${
          showSidebar ? "translate-x-0 " : "translate-x-full"
        }`}
      >
        <h3 className="mt-15 text-2xl font-semibold text-white">
          Explore new users{" "}
        </h3>
        {users?.length > 0 ? (
          <Card className="users-list">
            <List className="gap-3.5">
              {users.length > 0 &&
                users.map((user: any, index: Key) => {
                  return (
                    !checkBlocked(user) && (
                      <ListItem
                        onClick={() => handleRedirectProfile(user)}
                        key={index}
                        className="border-b-2 p-4 flex justify-between friend-card"
                      >
                        <div className="flex flex-row items-center gap-3.5">
                          <ListItemPrefix>
                            <Avatar
                              variant="circular"
                              alt="candice"
                              src={user.avatar}
                            />
                          </ListItemPrefix>

                          <Typography variant="h6" color="blue-gray">
                            {user?.username}
                          </Typography>
                          {userFriends.some(
                            (friend: any) => friend.username === user.username
                          ) && (
                            <Typography variant="h6" color="green">
                              <BiUserCheck
                                style={{ color: "green", fontSize: "26px" }}
                              />
                            </Typography>
                          )}
                        </div>
                      </ListItem>
                    )
                  );
                })}
            </List>
          </Card>
        ) : (
          <div className="friends-list">It looks like there is no users yet to add</div>
        )}
      </div>
    </>
  );
};

export default Users;
