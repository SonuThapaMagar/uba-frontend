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
  LOGIN_ERROR: 'Invalid credentials. Please try again.',
  SIGNUP_SUCCESS: 'Signup successful! Please wait for admin approval.',
  SIGNUP_ERROR: 'Failed to sign up. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  ACCESS_DENIED: 'Access denied! You don\'t have permission for this action.',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  USER_APPROVED: 'User approved successfully!',
  USER_DECLINED: 'User declined successfully!',
  USER_APPROVE_ERROR: 'Failed to approve user. Please try again.',
  USER_DECLINE_ERROR: 'Failed to decline user. Please try again.',
  
  // Form Validation
  REQUIRED_FIELDS: 'Please fill in all required fields.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_REQUIREMENTS: 'Password must be at least 6 characters long.',
  
  // General
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
} as const;
