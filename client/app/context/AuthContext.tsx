import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  baseUrlUsers,
  getRequest,
  postRequest,
  putRequest,
} from "./utils/service";
import { LoginError, User, userInit, LoginErrorInit } from "./utils/types";
import { baseUrlAuth } from "./utils/service";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { blockedUsers } from "@/interfaces/channels";
import io, { Socket } from "socket.io-client";
import { showSnackbar } from "./utils/showSnackBar";
// import socketIO from 'socket.io-client';
// ADDED BY ZAC
/// create useState Where you can get blocked users && update it when the users is blocked from chat
/// the resposne from back end is the username of the blocked user
// we will change change to context api and we must always setBlockedUsers if new user have been block by the current user

let notifSocket: Socket;
export const AuthContext = createContext<any>({});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [tfaDisabled, setTfaDisabled] = useState(true);
  const [loginError, setLoginError] = useState<LoginError>();
  const router = useRouter();
  const [cookie, setCookie, remove] = useCookies(["access_token"]);
  const [currentWindow, setCurrentWindow] = useState("");
  const [pathname, setPathname] = useState<string>("");
  const [notif, setNotif] = useState<[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<[]>([]);
  const [userBlockedMe, setUserBlockedMe] = useState<[]>([]);
  const [friendsList, setFriendsList] = useState<[]>([]);
  const [friendRequestSent, setFriendRequestSent] = useState<[]>([]);
  const [userFriendRequests, setUserFriendRequests] = useState();
  const [gameRequest, setGameRequest] = useState<[]>([]);
  // here we will aded states to save data cames from sockets
  const Urls = {
    home: "",
    gameHistory: "game-history",
    instructions: "instructions",
    aboutUs: "about-us",
    login: "login",
    tfaLogin: "tfalogin",
  };
  useEffect(() => {
   (async () => {
    try{
        if (checkPath()) return;
        if (cookie && cookie.access_token)
        {
          const response = await getRequest(`${baseUrlAuth}/jwtVerification`);
          console.log("response +++", response);
          if (response?.error)
            return;
          else window.location.href ="/profile";
        }
    }catch(err)
    {

    }
  })()
}, []);
  const checkPath = () => {
    setPathname("");
    const currentPath = window.location.href.split("/");

    if (
      (currentPath[4] && currentPath[4] === Urls.tfaLogin) ||
      (currentPath[3] === Urls.login && currentPath[4] === undefined)
    )
      return false;
    if (
      currentPath[3] === Urls.home ||
      currentPath[3] === Urls.gameHistory ||
      currentPath[3] === Urls.instructions ||
      currentPath[3] === Urls.aboutUs
    )
      return false;
    return true;
  };

  const fetchUserData = async () => {
    try{
    const response = await getRequest(`${baseUrlUsers}/user`);
    if (response?.error) {
      setLoginError(response);
      return false;
    }
    if (response?.error && response?.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
  }
    setUser(response);
}catch(err)
{

}
};

  const fetchFriendList = async () => {
    try{
    const friendList = await getRequest(`${baseUrlUsers}/user/friends`);
    if (friendList.error && friendList.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
  }
    setFriendsList(friendList);
  }catch(err)
    {

    }
  };

  const fetchFriendRequestSent = async () => {
    try {
      const response = await getRequest(`${baseUrlUsers}/requestFriendSent`);
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      setFriendRequestSent(response);
    } catch (err) {

    }
  };
  const fetchFriendRequests = async () => {
    try {
      const response = await getRequest(`${baseUrlUsers}/getFriendRequests`);
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      setUserFriendRequests(response);
    } catch (err) {

    }
  };
  const fetchGameRequest = async () =>{
    try{
    const response = await getRequest(`${baseUrlUsers}/gameRequests`)
    if (response?.error && response?.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
  }
    setGameRequest(response);
    } catch(err)
    {

    }
  }
  useEffect(() => {
    if (!checkPath()) return;
    console.log("+++++++---?????");
    try{
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/user`);
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
    if (response?.error)
      return ;
    response.tfa === false ? setTfaDisabled(true) : setTfaDisabled(false);
    console.log(response);
    setUser(response);
    return true;
    })();
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/blockedUsers`);
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      setBlockedUsers(response);
    })();
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/UsersBlockedMe`);
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      setUserBlockedMe(response);
    })();
    (async () => {
      await fetchFriendList();
      await fetchFriendRequestSent();
      await fetchFriendRequests();
      await fetchGameRequest();
    })();
  }catch(err)
  {

  }
  }, []);
  const updatingInfos = useCallback(
    async (username: string, password: string) => {
      try{
      const response = await putRequest(
        `${baseUrlUsers}/user`,
        JSON.stringify({ username, password })
      );
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      if (response?.error) {
        setLoginError(response);
        return false;
      }
      setUser(response);
      return true;
    }catch(err)
  {
  }},
    []
  );

  const updateUserInfo = useCallback(async (body: any) => {
    try{
    const response = await putRequest(
      `${baseUrlUsers}/users/update`,
      JSON.stringify(body)
    );
    if (response?.error && response?.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
  }
    if (response?.error) {
      setLoginError(response);
      return false;
    }
    setUser(response);
    return true;
  }catch(err)
  {
  }
  }, []);

  const LogIn = useCallback(async (loginInfo: any) => {
    try{
    const response = await postRequest(
      `${baseUrlAuth}/signin`,
      JSON.stringify(loginInfo)
    );
    if (response?.error && response?.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
  }
    if (response?.error) {
      setLoginError(response);
      return false;
    }
    setUser(response);
    return true;
  }catch(err)
  {
    return false;
  }
  }, []);

  const handleDisable2fa = async () => {
    try{
    const response = await putRequest(`${baseUrlUsers}/user/disable2fa`, "");
    if (response?.error && response?.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
  }
    setTfaDisabled(true);
}catch(err)
{
}
  };

  const HandleClickUpdate = useCallback(async (UpdateInfo: any) => {
   try{ setLoginError(LoginErrorInit);
    const response = await putRequest(
      `${baseUrlUsers}/users/update`,
      UpdateInfo
    );
    if (response?.error && response?.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
  }
    if (response?.error) {
      return false;
    }
    return true;}
    catch(err)
    {

    }
  }, []);

  useEffect(() => {
  notifSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/notifications`, {
  auth: {
  token: cookie.access_token,
  },
  });
  notifSocket.on("connected", () => {
  console.log("connected notif");
  });
  notifSocket.on("logout", () => {
  console.log("loging out");
  remove("access_token");
  router.push("/login");
  });
  notifSocket.on("accepted", (data: any) => {
  if (user.username !== data.username)
  showSnackbar(`${data.username} accepted you game request`, true);
  else{
  let updated: any;
  updated = gameRequest.filter((game: any)=>{
  return game.username != user.username
  })
  setGameRequest(updated);
  }
      router.push("/game");
  });
  notifSocket.on("gameRequest", (data: any) => {
  showSnackbar(
  `you have a game request from ${data[0].username}, check your notifications to accepte or refuse`,
  true
  );
  console.log("game data", data);
  setGameRequest(data);
  });
  return () => {
  notifSocket.disconnect();
  };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        loginError: loginError,
        LogIn,
        cookie,
        updatingInfos,
        updateUserInfo,
        tfaDisabled,
        handleDisable2fa,
        fetchUserData,
        blockedUsers,
        userBlockedMe,
        setUserBlockedMe,
        setBlockedUsers,
        friendsList,
        setFriendsList,
        fetchFriendList,
        setFriendRequestSent,
        friendRequestSent,
        userFriendRequests,
        gameRequest,
        setGameRequest,
        fetchFriendRequests,
        fetchGameRequest,
        setUserFriendRequests,
        notifSocket,
        setNotif,
      }}
    >
      <div id="snackbar"></div>
      {children}
    </AuthContext.Provider>
  );
};
