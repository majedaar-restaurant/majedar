import { config } from '../config/env.js';

export const setAuthCookie = (res, token) => {
    res.cookie(config.cookie.name, token, {
        httpOnly: config.cookie.httpOnly,
        secure: config.cookie.secure,
        sameSite: config.cookie.sameSite,
        maxAge: config.cookie.maxAge,
        path: config.cookie.path,
    });
};

/**
 * Clear the authentication cookie.
 * @param {import('express').Response} res
 */
export const clearAuthCookie = (res) => {
    res.clearCookie(config.cookie.name, {
        httpOnly: config.cookie.httpOnly,
        secure: config.cookie.secure,
        sameSite: config.cookie.sameSite,
        path: config.cookie.path,
    });
};

export const setCustomerAuthCookie = (res, token) => {
    res.cookie(config.customerCookie.name, token, {
        httpOnly: config.customerCookie.httpOnly,
        secure: config.customerCookie.secure,
        sameSite: config.customerCookie.sameSite,
        maxAge: config.customerCookie.maxAge,
        path: config.customerCookie.path,
    });
};

export const clearCustomerAuthCookie = (res) => {
    res.clearCookie(config.customerCookie.name, {
        httpOnly: config.customerCookie.httpOnly,
        secure: config.customerCookie.secure,
        sameSite: config.customerCookie.sameSite,
        path: config.customerCookie.path,
    });
};

export const setRiderAuthCookie = (res, token) => {
    res.cookie(config.riderCookie.name, token, {
        httpOnly: config.riderCookie.httpOnly,
        secure: config.riderCookie.secure,
        sameSite: config.riderCookie.sameSite,
        maxAge: config.riderCookie.maxAge,
        path: config.riderCookie.path,
    });
};

export const clearRiderAuthCookie = (res) => {
    res.clearCookie(config.riderCookie.name, {
        httpOnly: config.riderCookie.httpOnly,
        secure: config.riderCookie.secure,
        sameSite: config.riderCookie.sameSite,
        path: config.riderCookie.path,
    });
};
