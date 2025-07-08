import { createContext, useContext, useEffect, useState } from "react";
import {setAccessToken as storeToken} from '../utils/Api'
import axios from "axios";


export const authContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({children}) => {
    const [AccessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const refreshToken = async () => {
            try {
                const { data } = await axios.get('http://localhost:5500/auth/refresh', { withCredentials: true });
                storeToken(data.accessToken);
                setAccessToken(data.accessToken);
            } catch (err) { 
                setIsLoading(false);
             }
        }
        refreshToken();
    }, []);
    useEffect(() => {
        if(AccessToken !== null && isLoading === true) {
            setIsLoading(false);
        }
    }, [AccessToken]);
    const login = async (pseudo, password) => {
        try {
                const res = await axios.post("http://localhost:5500/auth/login",{pseudo, password}, {
                    withCredentials: true})
                storeToken(res.data.accessToken);
                setAccessToken(res.data.accessToken);
                return {
                    success: true,
                }
                
            } catch (error) {
                if (error.response) {
                    return {
                        success: false,
                        error : false,
                        message: error.response.data == "pseudo"?["Incorrect Pseudo",""] : ["","Incorrect Password"]
                    }
                } else if (error.request) {
                    return {
                        success: false,
                        error : true,
                        message: {state : {message :'No response received: ' + error.request}}
                    }
                    
                } else {
                    return {
                        success: false,
                        error : true,
                        message: {state : {message :'Error setting up the request: ' + error.message}}
                    }
                }
            }
        };
    const logout = async () => {
        try {
            await axios.get("http://localhost:5500/auth/logout", {withCredentials: true });
        } catch (error) {
            console.error("Logout error:", error);
        }
        setAccessToken(null);
        storeToken(null);
    }
  return (
    <authContext.Provider value={{AccessToken,isLoading, setAccessToken, login, logout}}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
