import { buildSchema } from 'type-graphql';
import { authChecker } from './authChecker';
import { UserResolver } from '../resolvers/UserResolver';
import { AuthResolver } from '../resolvers/AuthResolver';
import path from 'path';

export const createSchema = async () => {
  return buildSchema({
    resolvers: [UserResolver, AuthResolver],
    emitSchemaFile: path.resolve(__dirname, '../../schema.graphql'),
    authChecker,
    validate: false
  });
};