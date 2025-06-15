import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { createSchema } from './schema/schema';
import { AppDataSource } from './config/database';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");

    const schema = await createSchema();
    console.log("Schema created");
        const server = new ApolloServer({
      schema,
      cors: { origin: '*' },
      context: ({ req }) => ({ req }) // Optional, for auth later
    });
    const { url } = await server.listen(4000);
    console.log(`Server ready at ${url}`);
  } catch (error) {
    console.error("Error during startup:", error);
  }
}

bootstrap().catch(console.error);