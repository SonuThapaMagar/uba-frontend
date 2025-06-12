const TOKEN_KEY = 'auth_token'; // Single key for sessionStorage
const ROLE_KEY = 'auth_role'; // Store role in sessionStorage

// Store token and role for the current session
export const storeToken = (token: string, role: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLE_KEY, role);
};

// Get token for the current session
export const getToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

// Get current logged-in role
export const getCurrentRole = (): string | null => {
  return sessionStorage.getItem(ROLE_KEY);
};

// Remove token and role for the current session
export const removeToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
};

// Check if any user is logged in
export const isAnyUserLoggedIn = (): boolean => {
  return sessionStorage.getItem(TOKEN_KEY) !== null;
};

// Validate role and token
export const validateRoleAndToken = (role: string): boolean => {
  const token = getToken();
  const currentRole = getCurrentRole();
  return token !== null && currentRole === role;
};