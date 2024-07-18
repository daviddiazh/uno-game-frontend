import { useCallback, useEffect, useState } from "react"
import io from "socket.io-client";

export const useSocket = ( apiUrl = '' ) => {
    const [ socket, setSocket ] = useState<any>(null);
    const [ online, setOnline ] = useState(false);

    const sockectConnect = useCallback(() => {
        const token = localStorage.getItem('token');

        const socketTemp = io(apiUrl, { 
            transports: ['websocket'],
            autoConnect: true,
            forceNew: true,
            query: {
                token,
            },
        }).connect();

        setSocket( socketTemp );
    }, [ apiUrl ]);

    const sockectDisconnect = useCallback(() => {
        socket?.disconnect();
    }, [ socket ]);

    useEffect(() => {
        setOnline( socket?.connected );
    }, [socket])

    useEffect(() => {
        socket?.on('connect', () => setOnline( true ))
    }, [socket])

    useEffect(() => {
        socket?.on('disconnect', () => setOnline( false ))
    }, [socket])

    return {
        socket,
        online,
        sockectConnect,
        sockectDisconnect,
    };
}
