import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Hobbies {
    @Field(() => Int)
    id!: number;

    @Field()
    name!: string;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}
