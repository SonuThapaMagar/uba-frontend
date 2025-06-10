import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { User } from '../entities/User';
import { SignupInput } from '../entities/AuthInput';
import { AppDataSource } from '../config/database';

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async user(@Arg('id') id: string): Promise<User | null> {
        return AppDataSource.getRepository(User).findOneBy({ id });
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return AppDataSource.getRepository(User).find();
    }

    @Mutation(() => User)
    async updateUser(
        @Arg('id') id: string,
        @Arg('input') input: SignupInput
    ): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });
        
        if (!user) {
            throw new Error('User not found');
        }

        user.email = input.email;
        user.fname = input.fname;
        user.lname = input.lname;

        return userRepository.save(user);
    }

    @Mutation(() => String)
    async deleteUser(@Arg('id') id: string): Promise<string> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });
        
        if (!user) {
            throw new Error('User not found');
        }

        await userRepository.remove(user);
        return id;
    }
}