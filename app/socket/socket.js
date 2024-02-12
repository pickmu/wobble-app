// socket.js (Socket module)
import { io } from "socket.io-client";
import { useEffect, useState } from "react";


const Socket = io(`${process.env.EXPO_PUBLIC_API_URL}`);

export {Socket};

// useSocket.js (Custom Hook)


function useSocket() {
  const [isConnected, setIsConnected] = useState(Socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    Socket.on("connect", onConnect);
    Socket.on("disconnect", onDisconnect);
    Socket.on("foo", onFooEvent);

    return () => {
      Socket.off("connect", onConnect);
      Socket.off("disconnect", onDisconnect);
      Socket.off("foo", onFooEvent);
    };
  }, []);

  return { isConnected, fooEvents,Socket  };
}

export { useSocket};
