import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { baseUrlUsers, getRequest, postRequest, putRequest } from './utils/service';
import { LoginError, User, userInit, LoginErrorInit} from './utils/types';
import { baseUrlAuth } from './utils/service';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';


export const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: {
    children: React.ReactNode
}) => {

    const [user, setUser] = useState<User>(userInit);
    const [loginError, setLoginError] = useState<LoginError>();
    const router = useRouter();
    const [cookie, setCookie] = useCookies(['access_token']);
    const [currentWindow, setCurrentWindow] = useState("");

    // useEffect(() =>{
    //     if (cookie.access_token === '' || !cookie.access_token) 
    //         router.replace("/login");
    //     },[cookie.access_token, router])

    const fetchUserData = async () => {
        const response = await getRequest(`${baseUrlUsers}/user`)
        if (response.error) {
            setLoginError(response);
            router.replace("/login");
            return false;
        }
        // console.log("response", response);

        setUser(response);
    };

    useEffect(() => {
        (async () => {
            const response = await getRequest(`${baseUrlUsers}/user`)
            if (response.error) {
                setLoginError(response);
                return false;
            }
            // console.log("response", response);

            setUser(response);
            return true;
        })();
    }, []);
     

    const updatingInfos = useCallback(async  (username : string, password: string ) => {

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
    }, []);


    const updateUserInfo = useCallback(async  (body: any) =>
    {
        const response = await putRequest(`${baseUrlUsers}/users/update`, JSON.stringify(body))
        if (response.error) {
            setLoginError(response);
            return false;
        }
        // console.log("response", response);
        setUser(response);
        return true;
    }, [])

    const LogIn = useCallback(async (loginInfo: any) => {
        const response = await postRequest(
            `${baseUrlAuth}/signin`,
            JSON.stringify(loginInfo)
        )

        if (response.error) {
            setLoginError(response);
            return false;
        }
        setUser(response)
        return true;
    }, []);

    const HandleClickUpdate = useCallback(async (UpdateInfo: any) =>
    {
        setLoginError(LoginErrorInit);
        const response = await putRequest(`${baseUrlUsers}/users/update`, UpdateInfo);

        if (response.error) {
            return false;
        }
        console.log("Updated Succefully!!");
        return true;
    },[])

    return (
        <AuthContext.Provider value={{ user: user, loginError: loginError, LogIn, updatingInfos, updateUserInfo}}>
            {children}
        </AuthContext.Provider>
    );
};