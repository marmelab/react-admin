import { ApolloClient, createNetworkInterface } from 'apollo-client';
import buildApolloClient from 'ra-data-graphql-simple';
import gql from 'graphql-tag';

const client = new ApolloClient({
    networkInterface: createNetworkInterface({
        uri: 'http://localhost:4000/graphql',
    }),
});

const getOneCommandQuery = gql`
    query Command($id: ID!) {
        data: Command(id: $id) {
            id
            reference
            date
            status
            returned
            tax_rate
            total
            delivery_fees
            total_ex_taxes
            Customer {
                id
                first_name
                last_name
            }
            basket
        }
    }
`;

export default () =>
    buildApolloClient({
        client,
        override: {
            Command: {
                GET_ONE: () => ({
                    query: getOneCommandQuery,
                }),
            },
        },
    });
