import React, {
  createContext, useContext, useEffect, useState, useMemo,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export function SocketProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!process.env.REACT_APP_SOCKET_SERVER_URL) {
      console.error('SOCKET_SERVER_URL is not defined');
      return undefined;
    }

    const newSocket = io(process.env.REACT_APP_SOCKET_SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const value = useMemo(() => ({ socket }), [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket(): SocketContextValue {
  return useContext(SocketContext);
}
