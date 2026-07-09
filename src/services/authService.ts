import { API_CONFIG } from "../config/apiConfig";

const BASE_URL = API_CONFIG.BASE_URL + "/api";

export const authService = {
  async register(data: any) {
    const response = await fetch(
      `${BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    return response.json();
  },

  async verifyOtp(email: string, otp: string) {
    const response = await fetch(
      `${BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_OTP}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      },
    );
    return response.json();
  },

  async login(data: any) {
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async createCheckout(token: string) {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/payments/create-checkout`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      },
    );
    return response.json();
  },

  async syncSession(sessionId: string, token: string) {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/payments/sync-session`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      },
    );
    return response.json();
  },

  async forgotPassword(email: string) {
    const response = await fetch(
      `${BASE_URL}${API_CONFIG.ENDPOINTS.FORGOT_PASSWORD}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );
    return response.json();
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
    token: string,
  ) {
    const response = await fetch(
      `${BASE_URL}${API_CONFIG.ENDPOINTS.CHANGE_PASSWORD}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    );
    return response.json();
  },
};
