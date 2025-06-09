import axios, { AxiosError } from 'axios';
import { DocumentNode } from '@apollo/client';

const API_URL = 'http://localhost:4000/graphql';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const graphQLRequest = async (query: DocumentNode | string, variables?: any) => {
  try {
    const queryString = typeof query === 'string' ? query : query.loc?.source.body;
    
    const response = await api.post('', {
      query: queryString,
      variables: variables || {}
    });
    
    if (response.data.errors) {
      console.error('GraphQL Error:', response.data.errors);
      throw new Error(response.data.errors[0].message);
    }
    
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('GraphQL Error:', error.response?.data);
      throw new Error(error.response?.data?.errors?.[0]?.message || 'An error occurred');
    }
    throw error;
  }
};

export default api;