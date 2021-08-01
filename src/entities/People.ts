import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class People {
    @Field()
    _id?: string;

    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field(() => Int)
    age!: number;

    @Field()
    createdAt?: Date;

    @Field()
    updatedAt?: Date;
}
