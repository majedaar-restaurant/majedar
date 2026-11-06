import { io } from "socket.io-client";

let socket = null;
let socketUserType = null;

/**
 * Derives the Socket.IO server base URL from NEXT_PUBLIC_API_URL.
 * E.g., "http://localhost:5000/api" -> "http://localhost:5000"
 */
export function getSocketBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
}

/**
 * Get or create the shared Socket.IO client instance.
 * Transports: ['websocket', 'polling'] with credentials for HttpOnly cookie auth.
 */
export function getSocket(userType = null) {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socket) {
    const url = getSocketBaseUrl();
    socketUserType = userType;
    socket = io(url, {
      withCredentials: true,
      auth: userType ? { userType } : {},
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket] connection error:", err.message);
    });
  } else if (userType && socketUserType !== userType) {
    socketUserType = userType;
    socket.auth = { userType };
    if (socket.active) socket.disconnect();
  }

  return socket;
}

/**
 * Connect the socket if not already connected.
 */
export function connectSocket(userType = "customer") {
  const s = getSocket(userType);
  if (s && !s.connected) {
    s.connect();
  }
  return s;
}

/**
 * Disconnect socket cleanly if active.
 */
export function disconnectSocket() {
  if (socket) socket.disconnect();
}

/**
 * Join a customer order room.
 * Backend securely validates that the authenticated customer owns this order.
 */
export function joinOrderRoom(orderId, callback) {
  const s = connectSocket("customer");
  if (!s || !orderId) return;

  const emitJoin = () => {
    s.emit("join:order", { orderId }, (res) => {
      if (res?.error) {
        console.warn("[REALTIME] Failed to join order room:", res.error);
      }
      if (typeof callback === "function") {
        callback(res);
      }
    });
  };

  if (s.connected) {
    emitJoin();
  } else {
    s.once("connect", emitJoin);
  }
}

/**
 * Leave a customer order room.
 */
export function leaveOrderRoom(orderId) {
  if (socket && socket.connected && orderId) {
    socket.emit("leave:order", { orderId });
  }
}
