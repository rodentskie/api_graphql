import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conn = async () => {
    // connect
    const uri = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=false`;
    const db = await connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });

    // return connection
    return db;
};

export default conn;
