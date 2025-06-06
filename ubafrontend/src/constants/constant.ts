export const TOAST_MESSAGES = {
  // User Creation
  USER_CREATED: 'User created successfully!',
  USER_CREATE_ERROR: 'Failed to create user. Please try again.',
  
  // User Update
  USER_UPDATED: 'User updated successfully!',
  USER_UPDATE_ERROR: 'Failed to update user. Please try again.',
  EMAIL_EXISTS: 'Email already registered. Please use a different email.',
  
  // User Deletion
  USER_DELETED: 'User deleted successfully!',
  USER_DELETE_ERROR: 'Failed to delete user. Please try again.',
  USER_NOT_FOUND: 'User not found.',
  
  // Authentication
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_ERROR: 'Invalid email or password.',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  
  // Form Validation
  REQUIRED_FIELDS: 'Please fill in all required fields.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_REQUIREMENTS: 'Password must be at least 6 characters long.',
  
  // General
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.'
} as const;
