import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    fname: String!
    lname: String!
    password: String
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input SignupInput {
    email: String!
    password: String!
    fname: String!
    lname: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    signup(input: SignupInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
  }
`;