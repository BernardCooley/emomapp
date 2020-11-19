import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from "apollo-link-http";

const link = createHttpLink({
    uri: "http://10.0.2.2:4000/graphql"
});

const apolloSetup = new ApolloClient({
    cache: new InMemoryCache(),
    link,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network'
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