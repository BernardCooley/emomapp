import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { Storage } from '@google-cloud/storage';
import path from 'path';

import { typeDefs } from './typedefs';
import { resolvers } from './resolvers';
import { MONGO_DATABASE_NAME, MONGO_PASSWORD } from './constants';

const startServer = async () => {

    const gc = new Storage({
        keyFilename: path.join(__dirname, '../../keys/emom-84ee4-5357112afa88.json'),
        projectId: 'emom-84ee4'
    });

    const filesBucket = gc.bucket('emom-files');

    const endPoint = 'http://localhost:4000/graphql';

    const app = express();

    const server = new ApolloServer({
        typeDefs, resolvers
    });

    server.applyMiddleware({ app });

    await mongoose.connect(`mongodb+srv://coolTechAdmin:${MONGO_PASSWORD}@cluster0.s4e1a.mongodb.net/${MONGO_DATABASE_NAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    mongoose.set('debug', true);

    app.listen({ port: 4000 }, () =>
        console.log(`Server ready at: ${endPoint}`)
    )
}

startServer();