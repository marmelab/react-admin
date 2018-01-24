import { ApolloClient, createNetworkInterface } from 'apollo-client';
import buildApolloClient from 'ra-data-graphql-simple';

const client = new ApolloClient({
    networkInterface: createNetworkInterface({
        uri: 'http://localhost:4000/graphql',
    }),
});

export default () => buildApolloClient({ client });
