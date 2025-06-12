import { InputType, Field, ObjectType } from 'type-graphql';
import { User } from './User';

@InputType()
export class SignupInput {
  @Field()
  email: string;

  @Field({ nullable: true })
  password?: string;

  @Field()
  fname: string;

  @Field()
  lname: string;

  @Field({ nullable: true })
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
}