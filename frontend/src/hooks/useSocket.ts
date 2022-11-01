import { useCallback, useEffect, useState } from "react";
import { Manager, Socket } from "socket.io-client";
import { WS_URL } from "../constants";
import { SocketEvents } from "../events";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [online, setOnline] = useState<boolean>(false);

  const connectSocket = useCallback(() => {
    const manager = new Manager(WS_URL);

    const socket = manager.socket("/");
    setSocket(socket);
  }, []);

  const disconnectSocket = useCallback(() => {
    socket?.disconnect();
  }, [socket]);

  // Event listeners
  useEffect(() => {
    setOnline(Boolean(socket?.connected));
  }, [socket]);

  useEffect(() => {
    socket?.on(SocketEvents.CONNECT, () => setOnline(true));
  }, [socket]);

  useEffect(() => {
    socket?.on(SocketEvents.DISCONNECT, () => setOnline(false));
  }, [socket]);

  return {
    socket,
    online,
    connectSocket,
    disconnectSocket,
  };
}
