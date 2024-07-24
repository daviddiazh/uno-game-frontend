import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth/AuthContext";

export const ProtectedRoute: React.FC<any> = ({ children }) => {
    //TODO! validate usersId to play game
    const { token } = useContext(AuthContext);

    if( !token ) {
        localStorage.removeItem('token')
        return <Navigate to='/' />;
    }

    return children;
}
