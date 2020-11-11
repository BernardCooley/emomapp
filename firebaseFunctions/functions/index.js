const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const serviceAccount = require('./emom-84ee4-firebase-adminsdk-2309z-aab93226ec.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const typeDefs = gql`
    type Track {
        album: String,
        artist: String,
        artistId: String,
        description: String,
        genre: String,
        id: ID,
        title: String
    }
    type User {
        artist: String,
        artistImageUrl: String,
        artistName: String,
        bio: String,
        location: String,
        userId: String,
        website: String
    }
    type Query {
        tracks: [Track]
        users: [User]
    }
`

const resolvers = {
    Query: {
        async tracks() {
          const tracks = await admin
            .firestore()
            .collection('tracks')
            .get();
          return tracks.docs.map(track => track.data());
        },
        async users() {
            const users = await admin
              .firestore()
              .collection('users')
              .get();
            return users.docs.map(user => user.data());
          }
    }
}

const app = express();
const server = new ApolloServer({typeDefs, resolvers});

server.applyMiddleware({app, path: '/', cors: true});

exports.graph = functions.https.onRequest(app);