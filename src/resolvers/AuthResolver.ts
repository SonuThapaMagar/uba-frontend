import { Resolver, Mutation, Arg } from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { AuthResponse } from '../entities/AuthResponse';
import { LoginInput, SignupInput } from '../entities/AuthInput';
import { AppDataSource } from '../config/database';

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
  async signup(@Arg('input') input: SignupInput): Promise<AuthResponse> {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ email: input.email });
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const newUser = userRepository.create({
      email: input.email,
      fname: input.fname,
      lname: input.lname,
      password: hashedPassword
    });

    await userRepository.save(newUser);
    const token = jwt.sign({ userId: newUser.id }, 'your-secret-key', { expiresIn: '1h' });

    return { token, user: newUser };
  }

  @Mutation(() => AuthResponse)
  async login(@Arg('input') input: LoginInput): Promise<AuthResponse> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email: input.email });
    
    if (!user || !await bcrypt.compare(input.password, user.password)) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
    return { token, user };
  }
}