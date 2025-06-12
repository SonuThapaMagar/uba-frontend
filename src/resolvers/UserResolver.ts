import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { User } from '../entities/User';
import { SignupInput } from '../entities/AuthInput';
import { AppDataSource } from '../config/database';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';

@Resolver()
export class UserResolver {
    @Authorized(['SUPER_ADMIN', 'ADMIN','USER'])
    @Query(() => [User])
    async users(@Ctx() { req }: any): Promise<User[]> {
        return AppDataSource.getRepository(User).find();
    }

    @Query(() => User, { nullable: true })
    async currentUser(@Ctx() { currentUser }: any): Promise<User | null> {
      return currentUser || null;
    }
    
    @Authorized(['SUPER_ADMIN', 'ADMIN'])
    @Query(() => User, { nullable: true })
    async user(@Arg('id') id: string): Promise<User | null> {
        return AppDataSource.getRepository(User).findOneBy({ id });
    }

    @Authorized(['SUPER_ADMIN'])
    @Query(() => [User])
    async signupRequests(): Promise<User[]> {
        return AppDataSource.getRepository(User).find({ where: { isVerified: false, role: 'USER' } });
    }

    @Authorized(['SUPER_ADMIN'])
    @Mutation(() => User)
    async createUser(@Arg('input') input: SignupInput, @Ctx() { req }: any): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy({ email: input.email });
        if (existingUser) throw new Error('Email already exists');
        if (input.role === 'SUPER_ADMIN') throw new Error('Cannot create Super Admin');
        const defaultPassword = 'Default123!';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const user = userRepository.create({
            ...input,
            password: hashedPassword,
            role: input.role || 'USER',
            isVerified: true // Auto-verified for created users
        });
        return userRepository.save(user);
    }

    @Authorized(['SUPER_ADMIN'])
    @Mutation(() => User)
    async updateUser(@Arg('id') id: string, @Arg('input') input: SignupInput, @Ctx() { req }: any): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });
        if (!user) throw new Error('User not found');
        if (input.role === 'SUPER_ADMIN') throw new Error('Cannot set Super Admin role');
        user.email = input.email;
        user.fname = input.fname;
        user.lname = input.lname;
        if (input.role && user.role !== 'SUPER_ADMIN') user.role = input.role;
        if (input.password) user.password = await bcrypt.hash(input.password, 10);
        return userRepository.save(user);
    }

    @Authorized(['SUPER_ADMIN'])
    @Mutation(() => String)
    async deleteUser(@Arg('id') id: string): Promise<string> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });
        if (!user) throw new Error('User not found');
        if (user.role === 'SUPER_ADMIN') throw new Error('Cannot delete Super Admin');
        await userRepository.remove(user);
        return id;
    }

    @Authorized(['SUPER_ADMIN'])
    @Mutation(() => User)
    async approveUser(@Arg('id') id: string): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });
        if (!user) throw new Error('User not found');
        if (user.isVerified) throw new Error('User already verified');
        user.isVerified = true;
        return userRepository.save(user);
    }

    @Authorized(['SUPER_ADMIN'])
    @Mutation(() => String)
    async declineUser(@Arg('id') id: string): Promise<string> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });
        if (!user) throw new Error('User not found');
        await userRepository.remove(user);
        return id;
    }

    @Authorized(['SUPER_ADMIN', 'ADMIN', 'USER'])
    @Mutation(() => User)
    async updateProfile(@Arg('input') input: SignupInput, @Ctx() { req }: any): Promise<User> {
        const payload = jwt.verify(req.headers.authorization.replace('Bearer ', ''), JWT_SECRET) as { userId: string };
        const userId = payload.userId;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) throw new Error('User not found');
        user.email = input.email;
        user.fname = input.fname;
        user.lname = input.lname;
        if (input.password) user.password = await bcrypt.hash(input.password, 10);
        return userRepository.save(user);
    }
}