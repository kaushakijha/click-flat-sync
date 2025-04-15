interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  name: string;
}

// This is a mock API service. In a real application, you would make actual HTTP requests
export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a mock JWT token
        const token = `mock-jwt-token-${Math.random()
          .toString(36)
          .substring(7)}`;
        resolve(token);
      }, 1000);
    });
  },

  async signup(credentials: SignupCredentials): Promise<string> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a mock JWT token
        const token = `mock-jwt-token-${Math.random()
          .toString(36)
          .substring(7)}`;
        resolve(token);
      }, 1000);
    });
  },
};
