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
  const [user, setUser] = useState<User>(userInit);
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
    if (cookie.access_token === "" || !cookie.access_token)
      router.replace("/login");
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
    const response = await getRequest(`${baseUrlUsers}/user`);
    if (response.error) {
      setLoginError(response);
      return false;
    }
    setUser(response);
  };

  const fetchFriendList = async () => {
    const friendList = await getRequest(`${baseUrlUsers}/user/friends`);
    console.log(friendList);

    setFriendsList(friendList);
  };

  const fetchFriendRequestSent = async () => {
    try {
      const response = await getRequest(`${baseUrlUsers}/requestFriendSent`);
      setFriendRequestSent(response);
    } catch (err) {
      console.log("error fetching friendSent");
    }
  };
  const fetchFriendRequests = async () => {
    try {
      const response = await getRequest(`${baseUrlUsers}/getFriendRequests`);
      setUserFriendRequests(response);
    } catch (err) {
      console.log("error fetching friendRequest");
    }
  };
  const fetchGameRequest = async () =>{
    try{
    const response = await getRequest(`${baseUrlUsers}/gameRequests`)
    setGameRequest(response);
    } catch(err)
    {
      console.log("error fetching gameRequest");
    }
  }
  useEffect(() => {
    if (!checkPath()) return;
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/user`);
      if (response.error) {
        setLoginError(response);
        remove("access_token");
        router.push("/login");
        return false;
      }
      response.tfa === false ? setTfaDisabled(true) : setTfaDisabled(false);
      console.log(response);
      setUser(response);
      return true;
    })();
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/blockedUsers`);
      setBlockedUsers(response);
    })();
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/UsersBlockedMe`);
      setUserBlockedMe(response);
    })();
    (async () => {
      await fetchFriendList();
      await fetchFriendRequestSent();
      await fetchFriendRequests();
      await fetchGameRequest();
    })();
  }, []);
  const updatingInfos = useCallback(
    async (username: string, password: string) => {
      const response = await putRequest(
        `${baseUrlUsers}/user`,
        JSON.stringify({ username, password })
      );
      if (response.error) {
        setLoginError(response);
        return false;
      }
      setUser(response);
      return true;
    },
    []
  );

  const updateUserInfo = useCallback(async (body: any) => {
    const response = await putRequest(
      `${baseUrlUsers}/users/update`,
      JSON.stringify(body)
    );
    if (response.error) {
      setLoginError(response);
      return false;
    }
    setUser(response);
    return true;
  }, []);

  const LogIn = useCallback(async (loginInfo: any) => {
    const response = await postRequest(
      `${baseUrlAuth}/signin`,
      JSON.stringify(loginInfo)
    );

    if (response.error) {
      setLoginError(response);
      return false;
    }
    setUser(response);
    return true;
  }, []);

  const handleDisable2fa = async () => {
    const response = await putRequest(`${baseUrlUsers}/user/disable2fa`, "");
    setTfaDisabled(true);
  };
  const HandleClickUpdate = useCallback(async (UpdateInfo: any) => {
    setLoginError(LoginErrorInit);
    const response = await putRequest(
      `${baseUrlUsers}/users/update`,
      UpdateInfo
    );

    if (response.error) {
      return false;
    }
    return true;
  }, []);

  useEffect(() => {
    notifSocket = io("http://127.0.0.1:8080/notifications", {
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
