import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

const link = createUploadLink({ uri: 'http://10.0.2.2:4000/graphql' });

const apolloSetup = new ApolloClient({
    cache: new InMemoryCache(),
    link,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first'
        }
    },
    typePolicies: {
        Query: {
            fields: {
                artists: {
                    merge(existing, incoming) {
                        return { ...existing, ...incoming };
                      }
                },
                tracks: {
                    merge(existing, incoming) {
                        return { ...existing, ...incoming };
                      }
                }
            }
        }
    }
});

export default apolloSetup;