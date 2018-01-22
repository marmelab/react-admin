import { ApolloClient, createNetworkInterface } from 'apollo-client';
import buildApolloClient from 'ra-data-graphcool';
import gql from 'graphql-tag';

const client = new ApolloClient({
    networkInterface: createNetworkInterface('http://localhost:3000'),
});

const getOneCommandQuery = gql`
    query Command($id: ID!) {
        data: Command(id: $id) {
            id
            reference
            date
            status
            returned
            taxRate
            total
            deliveryFees
            totalExTaxes
            customer {
                id
                firstName
                lastName
            }
            basket {
                id
                product {
                    id
                    reference
                    price
                    stock
                }
                quantity
            }
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
