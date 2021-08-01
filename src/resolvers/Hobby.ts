import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Hobby } from '../entities/Hobby'; // entity
import HobbyModel from '../models/Hobby'; // model
import conn from '../data/index';

@InputType()
class HobbyInput {
    @Field()
    name!: string;
}

// type of object to be passed as parameter in a function
// https://simplernerd.com/typescript-dynamic-json/
interface myObj {
    [key: string]: any;
}

// validate input
const validateInsert = (obj: myObj) => {
    const { name } = obj;
    if (!name) throw new Error(`Please enter hobby name.`);
};

@Resolver()
export class Hobbies {
    // insert hobby
    @Mutation(() => Hobby)
    async createHobby(@Arg('options', () => HobbyInput) options: HobbyInput) {
        const db = await conn(); // create connection

        // validation
        validateInsert(options);

        // create new entity
        let hobby = new Hobby();
        // pass data and append dates
        hobby = {
            ...options,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // create new model
        const s = new HobbyModel(hobby);

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
    // select all hobby
    @Query(() => [Hobby])
    async selectAllHobbies() {
        const db = await conn(); // create connection
        const data = await new Promise((resolve, reject) => {
            HobbyModel.find((err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });
        await db.connection.close(); // close connection
        return data;
    }

    // select one hobby
    @Query(() => Hobby)
    async selectOneHobby(@Arg('id', () => String) id: String) {
        const db = await conn(); // create connection
        const data = await new Promise((resolve, reject) => {
            HobbyModel.findById(id, (err: String, docs: Object) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });
        await db.connection.close(); // close connection
        return data;
    }

    // update hobby
    @Mutation(() => Hobby)
    async updateHobby(@Arg('id', () => String) id: String, @Arg('options', () => HobbyInput) options: HobbyInput) {
        const db = await conn(); // create connection

        // validation
        validateInsert(options);

        // create new entity
        let hobby = new Hobby();
        // pass data and append dates
        hobby = {
            ...options,
            updatedAt: new Date()
        };

        // save to db
        const result: any = await new Promise((resolve, reject) => {
            HobbyModel.findByIdAndUpdate(
                id,
                hobby,
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

    // delete hobby
    @Mutation(() => Boolean)
    async deleteMovie(@Arg('id', () => String) id: String) {
        // connect to db
        const db = await conn();

        // save to db
        const result: any = await new Promise((resolve, reject) => {
            HobbyModel.findByIdAndRemove(id, {}, (err, data) => {
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
}
