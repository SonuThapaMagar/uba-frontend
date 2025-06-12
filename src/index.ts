import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { createSchema } from './schema/schema';
import { AppDataSource } from './config/database';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/User';
import { JWT_SECRET } from './config/constants';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function seedSuperAdmin() {
  const userRepository = AppDataSource.getRepository(User);
  const superAdmin = await userRepository.findOneBy({ role: 'SUPER_ADMIN' });
  console.log('Checking for existing super admin:', superAdmin ? 'Found' : 'Not found');

  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);
    const newSuperAdmin = await userRepository.save({
      email: 'superadmin@example.com',
      fname: 'Super',
      lname: 'Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
    });
    console.log('Super Admin created with ID:', newSuperAdmin.id);
  }
}

async function bootstrap() {
  await AppDataSource.initialize();
  await seedSuperAdmin();
  const schema = await createSchema();
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      let currentUser = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
          const userRepository = AppDataSource.getRepository(User);
          currentUser = await userRepository.findOneBy({ id: decoded.userId });
          if (!currentUser) {
            throw new Error('User not found');
          }
          if (currentUser.role !== decoded.role) {
            throw new Error('Role mismatch');
          }
        } catch (error) {
          console.error('Token verification failed:', error.message);
          currentUser = null;
        }
      }

      return {
        req,
        currentUser,
      };
    },
    cors: { origin: 'http://localhost:5173' },
  });
  const { url } = await server.listen(4000);
  console.log(`Server ready at ${url}`);
}

bootstrap().catch(console.error);