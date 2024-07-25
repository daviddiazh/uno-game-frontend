import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth/AuthContext";
import { useGameStore } from "../store/game";

export const ProtectedRoute: React.FC<any> = ({ children }) => {
    //TODO! validate usersId to play game
    const { userInvited, userInviting } = useGameStore();
    const { token } = useContext(AuthContext);

    if( !token ) {
        localStorage.removeItem('token')
        return <Navigate to='/' />;
    }

    if (!userInvited || !userInviting) return <Navigate to='/' />;

    return children;
}
