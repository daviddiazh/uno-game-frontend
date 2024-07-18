import { IUser } from '../interfaces/user';
import { AuthState } from './AuthProvider';

type AuthActionTypes = 
|   { type: 'Auth - Login', payload: IUser }
|   { type: 'Auth - Logout' }

export const authReducer = ( state: AuthState, action: AuthActionTypes ): AuthState => {

    switch( action.type ){
       case 'Auth - Login':
           return {
               ...state,
               status: 'authenticated',
               user: action.payload.user,
               token: action.payload.token,
           }
        case 'Auth - Logout':
            return {
                ...state,
                user: undefined,
                token: undefined,
                status: 'not-authenticated',
            }

       default:
           return state;
    }

}