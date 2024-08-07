import { createContext, useContext, useEffect } from "react";
import { envConfig } from "../../config/env";
import { useSocket } from "../../hooks/useSocket";
import { AuthContext } from "../auth/AuthContext";
import { Socket } from "socket.io-client";

interface SocketContextProps {
    socket: Socket;
    online: boolean;
}

export const SocketContext = createContext({} as SocketContextProps);

export const SocketProvider: React.FC<any> = ({ children }) => {

    const { socket, online, sockectConnect, sockectDisconnect } = useSocket(envConfig.apiUrl);

    const { status } = useContext(AuthContext);

    useEffect(() => {
        if (status === 'authenticated') sockectConnect();
    }, [status, sockectConnect]);

    useEffect(() => {
        if (status === 'not-authenticated') sockectDisconnect();
    }, [status, sockectDisconnect]);

    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}
