const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { Storage } = require('@google-cloud/storage');

const serviceAccount = require('./emom-84ee4-firebase-adminsdk-2309z-aab93226ec.json');
const keyfileName = require('./emom-84ee4-b1c62c1d7d9e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://emom-84ee4.firebaseio.com"
});

const storage = new Storage({
  projectId: 'emom-84ee4',
  keyFileName: keyfileName,
});

const typeDefs = gql`
    type DownloadURL {
      url: String
    }

    type Comment {
        artist: String,
        comment: String,
        userId: String,
        replies: [Comment]
    }

    type Track {
        album: String,
        artist: String,
        artistId: String,
        description: String,
        genre: String,
        id: ID,
        title: String,
        duration: Int,
        comments: [Comment]
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
        downloadUrls: DownloadURL
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
    },
    async downloadUrls() {
      try {
        const signedUrl = await storage
          .bucket('emom-84ee4.appspot.com')
          .file('tracks/ds5MaDn5ewxxvV0CK9GG.mp3')
          .getSignedUrl({ action: 'read', expires: '10-25-2022' });
        const url = signedUrl;
        console.log(url)
        return url;
      } catch (error) {
        console.error(error);
      }
    }
  }
}

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/', cors: true });

exports.graph = functions.https.onRequest(app);