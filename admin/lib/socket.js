import { io } from "socket.io-client";

let adminSocket = null;

/**
 * Derives the Socket.IO server base URL from NEXT_PUBLIC_API_URL.
 * E.g., "http://localhost:5000/api" -> "http://localhost:5000"
 */
export function getSocketBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
}

/**
 * Get or create the singleton Admin Socket.IO client instance.
 * Transports: ['websocket', 'polling'] with credentials for HttpOnly admin cookie auth.
 */
export function getAdminSocket() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!adminSocket) {
    const url = getSocketBaseUrl();
    adminSocket = io(url, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
    });

    adminSocket.on("connect_error", (err) => {
      console.warn("[REALTIME] Admin socket connection error:", err.message);
    });

    adminSocket.on("connect", () => {
      console.log("[REALTIME] Admin connected to Socket.IO server");
      adminSocket.emit("join:admin");
    });
  }

  return adminSocket;
}

/**
 * Connect the admin socket if not already connected.
 */
export function connectAdminSocket() {
  const s = getAdminSocket();
  if (s && !s.connected) {
    s.connect();
  }
  return s;
}

/**
 * Disconnect admin socket cleanly if active.
 */
export function disconnectAdminSocket() {
  if (adminSocket && adminSocket.connected) {
    adminSocket.disconnect();
  }
}
