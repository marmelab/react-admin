import buildApolloClient, { buildQuery } from 'ra-data-graphcool';
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

const listCommandsQuery = gql`
    query allCommands(
        $filter: CommandFilter
        $orderBy: CommandOrderBy
        $skip: Int
        $first: Int
    ) {
        items: allCommands(
            filter: $filter
            orderBy: $orderBy
            skip: $skip
            first: $first
        ) {
            basket {
                id
                product {
                    id
                }
            }
            createdAt
            customer {
                id
            }
            date
            deliveryFees
            id
            reference
            returned
            reviews {
                id
            }
            status
            taxes
            taxRate
            total
            totalExTaxes
            updatedAt
        }
        total: _allCommandsMeta(
            filter: $filter
            orderBy: $orderBy
            skip: $skip
            first: $first
        ) {
            count
        }
    }
`;

export default () =>
    buildApolloClient({
        clientOptions: {
            uri: 'https://api.graph.cool/simple/v1/cj2kl5gbc8w7a0130p3n4eg78',
        },
        buildQuery: introspectionResults => (raFetchType, resource, params) => {
            const builtQuery = buildQuery(introspectionResults)(
                raFetchType,
                resource,
                params
            );

            if (resource === 'Command') {
                if (raFetchType === 'GET_ONE') {
                    return {
                        ...builtQuery,
                        query: getOneCommandQuery,
                    };
                }
                if (raFetchType === 'GET_LIST') {
                    return {
                        ...builtQuery,
                        query: listCommandsQuery,
                    };
                }
            }

            return builtQuery;
        },
    });
