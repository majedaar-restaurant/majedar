import dotenv from 'dotenv';

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    port: parseInt(process.env.PORT, 10) || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production-min-32-chars',
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    },
    cookie: {
        name: 'token',
        // 8 hours in milliseconds by default
        maxAge: 8 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    },
    customerCookie: {
        name: 'customer_token',
        // 7 days in milliseconds by default for customers
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    },
    riderCookie: {
        name: 'rider_token',
        maxAge: 8 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    },
    cors: {
        origin: process.env.CLIENT_URL
            ? process.env.CLIENT_URL.includes(',')
                ? process.env.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/+$/, '')).filter(Boolean)
                : process.env.CLIENT_URL.trim().replace(/\/+$/, '')
            : true,
        credentials: true,
    },
    resendApiKey: process.env.RESEND_API_KEY || '',
    emailFrom: process.env.EMAIL_FROM || 'Majedaar Restaurant <noreply@majedaar.com>',
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID || '',
        keySecret: process.env.RAZORPAY_KEY_SECRET || '',
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    },
    onlinePaymentEnabled: process.env.ONLINE_PAYMENT_ENABLED === 'true',
    riderAssignmentTimeoutMinutes: Math.max(1, Number.parseInt(process.env.RIDER_ASSIGNMENT_TIMEOUT_MINUTES, 10) || 5),
    deliveryOverdueMinutes: Math.max(1, Number.parseInt(process.env.DELIVERY_OVERDUE_MINUTES, 10) || 90),
    vapid: {
        publicKey: process.env.VAPID_PUBLIC_KEY || '',
        privateKey: process.env.VAPID_PRIVATE_KEY || '',
        subject: process.env.VAPID_SUBJECT || 'mailto:majedarrestaurant@gmail.com',
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
};
