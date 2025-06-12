import { ExpressContext } from 'apollo-server-express';
import { AuthChecker } from 'type-graphql';
import { User } from '../entities/User'; 
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from './database';
import { JWT_SECRET } from './constants';

export const context = async ({ req }: ExpressContext) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let currentUser: User | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
      const userRepository = AppDataSource.getRepository(User);
      currentUser = await userRepository.findOneBy({ id: decoded.userId });
      if (!currentUser) {
        console.warn('Token valid but user not found:', decoded.userId);
      }
    } catch (error) {
      console.error('Token verification failed:', error.message);
    }
  }

  return { req, currentUser };
};

export const authChecker: AuthChecker<{ currentUser: User | null }> = ({ context }, roles) => {
  if (!context.currentUser) return false;
  if (roles.length === 0) return true;
  return roles.includes(context.currentUser.role);
};