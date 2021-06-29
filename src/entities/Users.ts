import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Users {
    @Field(() => Int)
    id!: number;

    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field(() => Int)
    age!: number;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}
