import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface People {
    firstName: String;
    lastName: String;
    age: Number;
    hobbies: [String];
    createdAt: Date;
    updatedAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<People>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    hobbies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Hobby' // model name
        }
    ],
    createdAt: Date,
    updatedAt: Date
});

// 3. Create a Model.
const PeopleModel = model<People>('People', schema);

export default PeopleModel;
