import { Arg, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { People } from '../entities/People'; // entity
import { Hobby } from '../entities/Hobby'; // entity
import PeopleModel from '../models/People'; // model
import conn from '../data/index';

// type of object to be passed as parameter in a function
// https://simplernerd.com/typescript-dynamic-json/
interface myObj {
    [key: string]: any;
}

@InputType()
class PeopleInput {
    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field(() => Int)
    age!: number;
}

// optional
@InputType()
class PeopleUpdate {
    @Field(() => String, { nullable: true })
    firstName!: string;

    @Field(() => String, { nullable: true })
    lastName!: string;

    @Field(() => Int, { nullable: true })
    age!: number;
}

// patch person's hobby
@InputType()
class PersonHobby {
    @Field(() => [String])
    hobbies!: [String];
}

// person with hobby
@ObjectType()
class PersonWithHobby extends People {
    @Field(() => [Hobby])
    hobbies!: [Hobby];
}

// validate input
const validateInsert = (obj: myObj) => {
    const { firstName, lastName, age } = obj;
    if (!firstName) throw new Error(`Please enter first name.`);
    if (!lastName) throw new Error(`Please enter last name.`);
    if (!age) throw new Error(`Please enter age.`);
};

@Resolver()
export class PeopleResolver {
    // insert person
    @Mutation(() => People)
    async createPerson(@Arg('options', () => PeopleInput) options: PeopleInput) {
        const db = await conn(); // create connection

        // validation
        validateInsert(options);

        // create new entity
        let person = new People();
        // pass data and append dates
        person = {
            ...options,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // create new model
        const s = new PeopleModel(person);

        // save to db
        const result: any = await new Promise((resolve, reject) => {
            s.save((err: any, data: any) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });

        await db.connection.close(); // close connection
        return result;
    }

    // select all people
    @Query(() => [People])
    async selectAllPeople() {
        const db = await conn(); // create connection
        const data = await new Promise((resolve, reject) => {
            PeopleModel.find((err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });
        await db.connection.close(); // close connection
        return data;
    }

    // select one person
    @Query(() => People)
    async selectOnePerson(@Arg('id', () => String) id: String) {
        const db = await conn(); // create connection
        const data = await new Promise((resolve, reject) => {
            PeopleModel.findById(id, (err: String, docs: Object) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });
        await db.connection.close(); // close connection
        return data;
    }

    // update person
    @Mutation(() => People)
    async updatePerson(@Arg('id', () => String) id: String, @Arg('options', () => PeopleUpdate) options: PeopleUpdate) {
        const db = await conn(); // create connection

        // validation
        validateInsert(options);

        // create new entity
        let person = new People();
        // pass data and append dates
        person = {
            ...options,
            updatedAt: new Date()
        };
        // save to db
        // save to db
        const result: any = await new Promise((resolve, reject) => {
            PeopleModel.findByIdAndUpdate(
                id,
                person,
                {
                    new: true // return new data
                },
                (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                }
            );
        });

        await db.connection.close(); // close connection
        return result;
    }

    // delete person
    @Mutation(() => Boolean)
    async deletePerson(@Arg('id', () => String) id: String) {
        // connect to db
        const db = await conn();

        // save to db
        const result: any = await new Promise((resolve, reject) => {
            PeopleModel.findByIdAndRemove(id, {}, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });

        await db.connection.close(); // close connection
        if (!result) return false;
        return true;
    }

    // patch hobby to person
    @Mutation(() => PersonWithHobby)
    async patchPersonHobby(@Arg('id', () => String) id: String, @Arg('options', () => PersonHobby) options: PersonHobby) {
        const db = await conn(); // create connection
        const hobbies = options.hobbies; // get hobbies

        // save to db
        const result: any = await new Promise((resolve, reject) => {
            PeopleModel.findOneAndUpdate({ _id: id }, { hobbies: hobbies }, { new: true }, (err, data) => {
                if (err) {
                    reject(err);
                }
                db.connection.close(); // close connection
                resolve(data);
            });
        });
        console.log(result);
        await db.connection.close(); // close connection

        // select the person and hobby
        const data = this.selectOnePersonWithHobby(id);
        return data;
    }

    // select one person with hobby
    @Query(() => PersonWithHobby)
    async selectOnePersonWithHobby(@Arg('id', () => String) id: String) {
        const db = await conn(); // create connection
        const data = await new Promise((resolve, reject) => {
            PeopleModel.findOne({ _id: id }, (err: String, data: Object) => {
                if (err) {
                    reject(err);
                }
                db.connection.close(); // close connection
                resolve(data);
            }).populate('hobbies');
        });
        await db.connection.close(); // close connection
        return data;
    }
}
