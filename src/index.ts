import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { createSchema } from './schema/schema';
import { AppDataSource } from './config/database';

async function bootstrap() {
  try {
    //  database connection
    await AppDataSource.initialize();
    console.log("Database connection established");

    const schema = await createSchema();
    const server = new ApolloServer({ schema, cors: { origin: 'http://localhost:5173' } });
    const { url } = await server.listen(4000);
    console.log(`Server ready at ${url}`);
  } catch (error) {
    console.error("Error during startup:", error);
  }
}

bootstrap().catch(console.error);