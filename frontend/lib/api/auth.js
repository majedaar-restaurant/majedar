import { apiRequest } from "./client";

/**
 * Customer authentication and profile API calls
 */

export async function customerSignup({ name, email, phone, password }) {
  return apiRequest("/customer-auth/signup", {
    method: "POST",
    body: { name, email, phone, password },
  });
}

export async function customerLogin({ email, password }) {
  return apiRequest("/customer-auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function customerLogout() {
  return apiRequest("/customer-auth/logout", {
    method: "POST",
  });
}

export async function getCustomerMe() {
  return apiRequest("/customer-auth/me", {
    method: "GET",
  });
}

export async function verifyEmail({ email, otp }) {
  return apiRequest("/customer-auth/verify-email", {
    method: "POST",
    body: { email, otp },
  });
}

export async function resendOtp({ email, type = "email_verification" }) {
  return apiRequest("/customer-auth/resend-otp", {
    method: "POST",
    body: { email, type },
  });
}

export async function forgotPassword({ email }) {
  return apiRequest("/customer-auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function resetPassword({ email, otp, newPassword }) {
  return apiRequest("/customer-auth/reset-password", {
    method: "POST",
    body: { email, otp, newPassword },
  });
}

export async function updateCustomerProfile({ name, phone }) {
  const response = await apiRequest("/customer-auth/profile", {
    method: "PATCH",
    body: { name, phone },
  });
  return response?.data?.customer || response?.data;
}

export async function getCustomerAddresses() {
  const response = await apiRequest("/customer-auth/addresses", {
    method: "GET",
  });
  return response?.data?.addresses || [];
}

export async function addCustomerAddress(addressData) {
  const response = await apiRequest("/customer-auth/addresses", {
    method: "POST",
    body: addressData,
  });
  return response?.data?.addresses || response?.data;
}

export async function updateCustomerAddress(addressId, addressData) {
  const response = await apiRequest(`/customer-auth/addresses/${addressId}`, {
    method: "PATCH",
    body: addressData,
  });
  return response?.data?.addresses || response?.data;
}

export async function deleteCustomerAddress(addressId) {
  const response = await apiRequest(`/customer-auth/addresses/${addressId}`, {
    method: "DELETE",
  });
  return response?.data?.addresses || response?.data;
}

export async function setDefaultCustomerAddress(addressId) {
  const response = await apiRequest(`/customer-auth/addresses/${addressId}/default`, {
    method: "PATCH",
  });
  return response?.data?.addresses || response?.data;
}

/**
 * Google Sign In — verify Google token and authenticate existing customer.
 * If customer is not registered, backend returns 404 with signupToken.
 * Does NOT auto-create account.
 * @param {string} idToken - Google ID token
 */
export async function customerGoogleLogin(idToken) {
  return apiRequest("/customer-auth/google/login", {
    method: "POST",
    body: { idToken },
  });
}

/**
 * Google Sign Up — explicitly create customer account with Google identity.
 * Rejects if account already exists with 409 Conflict.
 * @param {Object} params
 * @param {string} [params.idToken]
 * @param {string} [params.signupToken]
 */
export async function customerGoogleSignup({ idToken, signupToken }) {
  return apiRequest("/customer-auth/google/signup", {
    method: "POST",
    body: { idToken, signupToken },
  });
}

/**
 * Google OAuth dispatcher (backward compatibility)
 * @param {string} idToken
 * @param {'login'|'signup'} [intent='login']
 */
export async function customerGoogleAuth(idToken, intent = 'login') {
  return apiRequest("/customer-auth/google", {
    method: "POST",
    body: { idToken, intent },
  });
}

/**
 * Update phone number for authenticated customer.
 * Used by Google-registered customers collecting phone post-signup.
 * @param {string} phone - E.g. "+919876543210"
 */
export async function updateCustomerPhone(phone) {
  const response = await apiRequest("/customer-auth/update-phone", {
    method: "PATCH",
    body: { phone },
  });
  return response?.data?.customer || response?.data;
}
