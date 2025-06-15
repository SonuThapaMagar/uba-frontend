import { gql } from '@apollo/client';

export interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  isVerified: boolean;
}

export interface SignupInput {
  fname: string;
  lname: string;
  email: string;
  password?: string;
  role?: 'ADMIN' | 'USER';
}


export const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        id
        email
        fname
        lname
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        fname
        lname
        role
        isVerified
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      email
      fname
      lname
      role
      isVerified
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      fname
      lname
      role
      isVerified
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      fname
      lname
      role
      isVerified
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

export const APPROVE_USER = gql`
  mutation ApproveUser($id: String!) {
    approveUser(id: $id) {
      id
      email
      fname
      lname
      isVerified
    }
  }
`;

export const DECLINE_USER = gql`
  mutation DeclineUser($id: String!) {
    declineUser(id: $id)
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $input: SignupInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      fname
      lname
      role
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: SignupInput!) {
    updateProfile(input: $input) {
      id
      email
      fname
      lname
    }
  }
`;

export const GET_SIGNUP_REQUESTS = gql`
  query GetSignupRequests {
    signupRequests {
      id
      email
      fname
      lname
      isVerified
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: SignupInput!) {
    createUser(input: $input) {
      id
      email
      fname
      lname
      role
      isVerified
    }
  }
`;