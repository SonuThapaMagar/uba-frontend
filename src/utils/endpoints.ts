export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CREATE_USER: '/users',
  UPDATE_USER: (id: string) => `/users/${id}`,
  DELETE_USER: (id: string) => `/users/${id}`,
  GET_USERS: '/users',
};