import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Hobby {
    @Field()
    _id?: string;

    @Field()
    name!: string;

    @Field()
    createdAt?: Date;

    @Field()
    updatedAt?: Date;
}
