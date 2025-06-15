import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  fname: string;

  @Field()
  @Column()
  lname: string;

  @Column()
  password: string;

  @Field()
  @Column({ type: 'enum', enum: ['SUPER_ADMIN', 'ADMIN', 'USER'], default: 'USER' })
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';

  @Field()
  @Column({ default: false })
  isVerified: boolean;
}