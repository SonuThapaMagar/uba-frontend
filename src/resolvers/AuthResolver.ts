import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { AuthResponse, LoginInput, SignupInput } from '../entities/AuthInput';
import { User } from '../entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { JWT_SECRET } from '../config/constants';

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
  async signup(@Arg('input') input: SignupInput): Promise<AuthResponse> {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ email: input.email });
    if (existingUser) throw new Error('Email already exists');
    const hashedPassword = await bcrypt.hash(input.password || 'Default123!', 10);
    const user = userRepository.create({
      ...input,
      password: hashedPassword,
      role: 'USER', // Force role to USER
      isVerified: false
    });
    await userRepository.save(user);
    return { token: '', user }; // No token until verified
  }

  @Mutation(() => AuthResponse)
  async login(@Arg('input') input: LoginInput): Promise<AuthResponse> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email: input.email });
    if (!user) throw new Error('Invalid credentials');
    if (!user.isVerified) throw new Error('Account not verified');
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    // Ensure user object includes role
    return { token, user: { ...user, role: user.role } }; // Explicitly include role
  }

  @Query(() => Boolean)
  async testPassword(@Arg('email') email: string, @Arg('password') password: string): Promise<boolean> {
    const user = await AppDataSource.getRepository(User).findOneBy({ email });
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }
}