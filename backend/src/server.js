import http from 'node:http';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { config } from './config/env.js';
import { expireOverduePlacedOrders } from './services/order/order.service.js';
import { initSocketServer } from './socket/socket.server.js';

const PORT = config.port;

// Connect to MongoDB and start HTTP + Socket.IO listener
connectDatabase()
    .then(() => {
        const httpServer = http.createServer(app);
        initSocketServer(httpServer);

        httpServer.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });

        // Periodic background worker: check for orders that exceeded the 3-minute acceptance deadline
        setInterval(async () => {
            try {
                await expireOverduePlacedOrders();
            } catch (err) {
                console.error('[OrderExpiryService] Periodic expiration check failed:', err.message);
            }
        }, 15000).unref();
    })
    .catch((error) => {
        console.error('Failed to start server due to database connection error:', error.message);
        process.exit(1);
    });