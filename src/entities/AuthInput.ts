import { InputType, Field } from 'type-graphql';

  @InputType()
  export class LoginInput {
    @Field()
    email: string;

    @Field()
    password: string;
  }

  @InputType()
  export class SignupInput {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    fname: string;

    @Field()
    lname: string;
  }