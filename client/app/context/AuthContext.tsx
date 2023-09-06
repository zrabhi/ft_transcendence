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

    // useEffect(() =>{
    //     if (cookie.access_token === '' || !cookie.access_token) 
    //         router.replace("/login");
    //     },[cookie.access_token, router])
    useEffect(() => {
        (async () => {
            const response = await getRequest(`${baseUrlUsers}/user`)
            if (response.error) {
                setLoginError(response);
                return false;
            }
            console.log("response", response);

            setUser(response);
            return true;
        });
    }, [user]);

    const updatingInfos = async (username : string, password: string ) => {
    const response = await putRequest(
        `${baseUrlUsers}/users`,
        JSON.stringify({ username, password })
    );
    if (response.error) {
        setLoginError(response);
        return false;
    }

        // console.log("response", response);
        setUser(response);
        return true;
    };


    const updateUserInfo = async (body: any) =>
    {   
        const response = await putRequest(`${baseUrlUsers}/users/update`, JSON.stringify(body)) 
        if (response.error) {
            setLoginError(response);
            return false;
        }
        console.log("response", response);
        setUser(response);
        return true;
    }

    const LogIn = useCallback(async (loginInfo: any) => {
        const response = await postRequest(
            `${baseUrlAuth}/signin`,
            JSON.stringify(loginInfo)
        )

        if (response.error) {
            setLoginError(response);
            return false;
        }

        localStorage.setItem("User", JSON.stringify(response));
        console.log("response", response);

        setUser(response);
        // console.log("context", user);

        return true;
    }, []);

    const HandleClickUpdate = useCallback(async (UpdateInfo: any) => 
    {
        setLoginError(LoginErrorInit);
        const response = await putRequest(`${baseUrlUsers}/users/update`, UpdateInfo);

        if (response.error) {
            setLoginError(response);
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