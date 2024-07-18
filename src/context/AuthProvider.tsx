import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { IUser } from "../interfaces/user";
import { envConfig } from "../config/env";
import { authReducer } from "./authReducer";

type StatusInterface = | 'checking' | 'authenticated' | 'not-authenticated';

export interface AuthState{
    status: StatusInterface;
    user?: IUser['user'];
    token?: IUser['token'];
}


const AUTH_INITIAL_STATE: AuthState = {
    status: 'checking',
    user: undefined,
    token: undefined,
}

export const AuthProvider: React.FC<any> = ({ children }) => {
    const [ state, dispatch ] = useReducer(authReducer, AUTH_INITIAL_STATE);

    useEffect(() => {
        checkToken();
    }, []);

    useEffect(() => {
        
    }, []);

    const checkToken = async () => {
        const token = localStorage.getItem('token') ?? '';

        if( !token ) return;

        const config = {
            headers: {
                token,
            }
        }

        try {
            const { data } = await axios.get(`${envConfig.apiUrl}/api/auth/validate-token`, config);

            if (data?.code === 401) {
                return logout();
            }
            dispatch({ type: 'Auth - Login', payload: { user: {...data}, token } });
        } catch (error) {
            console.log(error)
        }
    }

    const login = async ( payload: IUser ): Promise<boolean> => { 
        try {
            dispatch({ type: 'Auth - Login', payload });
            localStorage.setItem('token', payload?.token);
            return true;
        } catch (error) {
            return false;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'Auth - Logout' });
    }

    return (
        <AuthContext.Provider value={{
            ...state, 

            checkToken,
            login,
            logout,
        }}>
            { children }
        </AuthContext.Provider>
    )
}