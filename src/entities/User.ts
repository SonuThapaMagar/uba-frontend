import { ObjectType, Field, ID } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@ObjectType()
@Entity()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    fname: string;

    @Field()
    @Column()
    lname: string;

    @Column()
    password: string;
}