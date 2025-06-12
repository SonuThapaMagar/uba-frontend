import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolvers/UserResolver';
import { AuthResolver } from '../resolvers/AuthResolver';
import path from 'path';

export const createSchema = async () => {
  return buildSchema({
    resolvers: [UserResolver, AuthResolver],
    emitSchemaFile: path.resolve(__dirname, '../../schema.graphql'),
    validate: false,
    authChecker: () => true,
  });
};