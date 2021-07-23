import { Resolver, Mutation, ObjectType, Arg, Int, Query, InputType, Field } from 'type-graphql';
import { Hobby } from '../entities/Hobby';

@InputType()
class HobbyInput {
    @Field()
    name!: string;
}

@Resolver()
export class Hobbies {
    // insert hobby
    @Mutation(() => Hobby)
    async createHobby(@Arg('options', () => HobbyInput) options: HobbyInput) {
        console.log(options);
        const movie = await Hobby.create(options).save();
        return movie;
    }
}
