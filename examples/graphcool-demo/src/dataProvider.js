import buildApolloClient from 'ra-data-graphcool';
import gql from 'graphql-tag';

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
        clientOptions: {
            uri: 'https://api.graph.cool/simple/v1/cj2kl5gbc8w7a0130p3n4eg78',
        },
        // We need to override the default Command query because we
        // to get the deeply nested products inside basket
        override: {
            Command: {
                GET_ONE: () => ({
                    query: getOneCommandQuery,
                }),
            },
        },
    });
