import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { baseUrlUsers, getRequest, postRequest } from './utils/service';
import { LoginError, User } from './utils/types';
import { baseUrlAuth } from './utils/service';


export const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: {
    children: React.ReactNode
}) => {

    const [user, setUser] = useState<User>();
    const [loginError, setLoginError] = useState<LoginError>();

    useEffect(() => {
        (async () => {
            const response = await getRequest(`${baseUrlUsers}/user`)
            if (response.error) {
                setLoginError(response);
                return false;
            }
            console.log("response", response);

            setUser(response);
            console.log("context", user);

            return true;
        })();

    }, []);

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
        console.log("context", user);

        return true;
    }, []);

    return (
        <AuthContext.Provider value={{ user: user, loginError: loginError, LogIn }}>
            {children}
        </AuthContext.Provider>
    );
};