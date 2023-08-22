// import { createContext, useContext, useState, useCallback } from 'react';
// import { baseURL, postRequest } from '../signin/utils/service';

// interface User {
//  id: string,
//  email: string,
//  username: string,
//  password: string,
//  avatar: string,
//  cover: string,
//  status: string,
//  country: string,
//  win: number,
//  loss: number,
//  ladder_level: number,
//  xp: number,
//  totalGames: number,
//  discordHandler: string,
//  twitterHandler: string,
//  created_date: string,
// }

// interface LoginError {
//   error: boolean;
//   message: string;
// }

// interface AuthContextType {
//   user: User;
//   loginError: LoginError;
//   logIn: (loginInfo: any) => Promise<boolean>;
// }

// const AuthContextInit = {
//     user: null,
//     loginError: {
//         error: false,
//         message: '',
//     },
//     logIn: (loginInfo: any) => {}

// }
// export const AuthContext = createContext({
//     user: {},
//     loginError:{
//         error: false,
//         message:'',
//     },

// });

// export const AuthProvider: React.FC = ({ children } : any) => {

//   const [userRes, setUser] = useState({});
    
//   const [log, setLog] = useState<Promise<Boolean>>();
//   const [loginErrorRes, setLoginError] = useState({
//     error: false,
//     message: '',
//   });

//   const LogIn = useCallback(async (loginInfo: any)  => {
//     const response = await postRequest(`${baseURL}/signin`, JSON.stringify(loginInfo));
//     console.log("something");
    
//     if (response.error) {
//       setLoginError(response);
//       return false;
//     }

//     localStorage.setItem('User', JSON.stringify(response));
//     setUser(response);
//     return true;
//   }, []);

//   setLog(LogIn);
//   return (
//     <AuthContext.Provider value={{ user: userRes,  loginError: loginErrorRes, }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
