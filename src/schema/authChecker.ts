import { AuthChecker } from 'type-graphql';
import { User } from '../entities/User';

export const authChecker: AuthChecker<{ currentUser: User | null }> = ({ context }, roles) => {
  if (!context.currentUser) return false;
  if (roles.length === 0) return true;
  return roles.includes(context.currentUser.role);
};
