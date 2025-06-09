import { gql } from '@apollo/client';

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
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      id
      email
      fname
      lname
    }
  }
`;
