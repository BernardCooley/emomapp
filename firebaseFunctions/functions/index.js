const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const serviceAccount = require('./emom-84ee4-firebase-adminsdk-2309z-aab93226ec.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const { Storage } = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({
  projectId: 'emom-84ee4'
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
        downloadUrls: [DownloadURL]
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
    // TODO Not working
    async downloadUrls() {
      const fn = async () => {
        try {
          const signedUrl = storage
            .bucket('tracks')
            .file('/ds5MaDn5ewxxvV0CK9GG.mp3')
            .getSignedUrl({ action: 'read', expires: '10-25-2022' }); // purposedly not awaiting here
          // do other stuff in the mean time
          const url = await signedUrl; // now I need the URL
          console.log(url)
        } catch (error) {
          console.error(error);
        }
      };
      fn();

      // const bucket = storage.bucket('tracks');
      // const file = bucket.file(`/ds5MaDn5ewxxvV0CK9GG.mp3`);

      // return file.getSignedUrl({
      //   action: 'read',
      //   expires: '03-09-2491'
      // }).then(signedUrls => {
      //   return signedUrls[0]
      // });
    }
  }
}

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/', cors: true });

exports.graph = functions.https.onRequest(app);