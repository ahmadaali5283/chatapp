import { io } from "socket.io-client";

let socket;

export function connectSocket(token) {
  const enabled = process.env.REACT_APP_ENABLE_SOCKET === "true";
  if (!enabled) {
    return null;
  }

  if (socket?.connected) return socket;

  socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
    transports: ["websocket"],
    auth: token ? { token } : undefined,
    withCredentials: true,
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
