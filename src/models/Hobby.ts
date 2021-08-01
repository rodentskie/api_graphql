import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface Hobby {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Hobby>({
    name: { type: String, required: true },
    createdAt: Date,
    updatedAt: Date
});

// 3. Create a Model.
const HobbyModel = model<Hobby>('Hobby', schema);

export default HobbyModel;
