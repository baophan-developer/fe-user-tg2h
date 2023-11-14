import React, { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";

const endpoint = "http://localhost:8080";

const SocketContext = createContext<any>(null);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socket = io(endpoint);

    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) throw new Error("useSocket must be used within a SocketProvider");
    return socket;
};

export { useSocket };

export default SocketProvider;
