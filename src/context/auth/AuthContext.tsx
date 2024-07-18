import { createContext } from 'react'
import { IUser } from '../../interfaces/user';

type StatusInterface = | 'checking' | 'authenticated' | 'not-authenticated';

interface ContextProps {
    status: StatusInterface;
    user?: IUser['user'];
    token?: IUser['token'];

    checkToken: () => void;
    login: ( payload: IUser ) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext({} as ContextProps);