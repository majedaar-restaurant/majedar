"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCustomerMe,
  customerLogin,
  customerLogout,
  customerSignup,
  verifyEmail,
  customerGoogleLogin,
  customerGoogleSignup,
  updateCustomerPhone,
} from "../lib/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated customer session on startup via HttpOnly cookie
  const refreshCustomer = useCallback(async () => {
    try {
      const response = await getCustomerMe();
      if (response?.data?.customer) {
        setCustomer(response.data.customer);
      } else {
        setCustomer(null);
      }
    } catch {
      // 401 / session expired or unauthenticated
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomer();
  }, [refreshCustomer]);

  const login = async ({ email, password }) => {
    const response = await customerLogin({ email, password });
    if (response?.data?.customer) {
      setCustomer(response.data.customer);
    }
    return response;
  };

  const signup = async ({ name, email, phone, password }) => {
    return customerSignup({ name, email, phone, password });
  };

  const verifyOtp = async ({ email, otp }) => {
    const response = await verifyEmail({ email, otp });
    if (response?.data?.customer) {
      setCustomer(response.data.customer);
    }
    return response;
  };

  /**
   * Google Sign In (Login Intent).
   * Authenticates existing customer via verified Google ID token.
   * If customer is not registered yet, returns { notRegistered: true, signupToken, email, name }.
   * Does NOT auto-create an account.
   *
   * @param {string} idToken - Google credential ID token
   */
  const googleLogin = async (idToken) => {
    try {
      const response = await customerGoogleLogin(idToken);
      if (response?.data?.customer) {
        setCustomer(response.data.customer);
      }
      return {
        success: true,
        customer: response?.data?.customer,
        needsPhone: response?.data?.needsPhone ?? (!response?.data?.customer?.phone),
      };
    } catch (err) {
      if (err?.status === 404 && err?.data?.signupToken) {
        return {
          notRegistered: true,
          signupToken: err.data.signupToken,
          email: err.data.email,
          name: err.data.name,
          message: err.message || "Your Google account is not registered yet. Please create an account to continue.",
        };
      }
      throw err;
    }
  };

  /**
   * Google Sign Up (Registration Intent).
   * Explicitly registers a new customer using Google identity.
   * If customer already exists, backend throws 409 Conflict.
   *
   * @param {Object} params
   * @param {string} [params.idToken]
   * @param {string} [params.signupToken]
   */
  const googleSignup = async ({ idToken, signupToken }) => {
    const response = await customerGoogleSignup({ idToken, signupToken });
    if (response?.data?.customer) {
      setCustomer(response.data.customer);
    }
    return {
      success: true,
      customer: response?.data?.customer,
      isNewUser: true,
      needsPhone: true,
    };
  };

  /**
   * Update the phone number for the authenticated customer.
   * Used for mandatory phone collection and profile updates.
   *
   * @param {string} phone - Phone number, e.g. "+919876543210"
   */
  const updatePhone = async (phone) => {
    const updatedCustomer = await updateCustomerPhone(phone);
    if (updatedCustomer) {
      setCustomer((prev) =>
        prev ? { ...prev, phone: updatedCustomer.phone ?? phone } : prev
      );
    }
    return updatedCustomer;
  };

  const logout = async () => {
    try {
      await customerLogout();
    } catch {
      // ignore logout network errors
    } finally {
      setCustomer(null);
    }
  };

  const updateCustomerState = (updatedCustomer) => {
    setCustomer((prev) => (prev ? { ...prev, ...updatedCustomer } : updatedCustomer));
  };

  const value = {
    customer,
    loading,
    isAuthenticated: Boolean(customer),
    login,
    signup,
    verifyOtp,
    googleLogin,
    googleSignup,
    updatePhone,
    logout,
    refreshCustomer,
    updateCustomerState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
