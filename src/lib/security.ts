import { encrypt, decrypt } from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "your-secret-key";

export const security = {
  // Secure token storage
  storeToken(token: string): void {
    const encryptedToken = encrypt(token, SECRET_KEY).toString();
    localStorage.setItem("secure_token", encryptedToken);
  },

  getToken(): string | null {
    const encryptedToken = localStorage.getItem("secure_token");
    if (!encryptedToken) return null;
    try {
      const decryptedToken = decrypt(encryptedToken, SECRET_KEY).toString(
        CryptoJS.enc.Utf8
      );
      return decryptedToken;
    } catch (error) {
      console.error("Failed to decrypt token:", error);
      return null;
    }
  },

  removeToken(): void {
    localStorage.removeItem("secure_token");
  },

  // Token validation
  validateToken(token: string): boolean {
    // Basic JWT token validation
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  },

  // Secure configuration storage
  storeConfig(config: any): void {
    const encryptedConfig = encrypt(
      JSON.stringify(config),
      SECRET_KEY
    ).toString();
    localStorage.setItem("secure_config", encryptedConfig);
  },

  getConfig(): any | null {
    const encryptedConfig = localStorage.getItem("secure_config");
    if (!encryptedConfig) return null;
    try {
      const decryptedConfig = decrypt(encryptedConfig, SECRET_KEY).toString(
        CryptoJS.enc.Utf8
      );
      return JSON.parse(decryptedConfig);
    } catch (error) {
      console.error("Failed to decrypt config:", error);
      return null;
    }
  },

  // HTTPS check
  isSecureConnection(): boolean {
    return window.location.protocol === "https:";
  },

  // Mask sensitive data
  maskToken(token: string): string {
    if (!token) return "";
    return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
  },

  maskPassword(password: string): string {
    return "••••••••";
  },
};
