import { ApolloClient, createNetworkInterface } from 'apollo-client';
import buildApolloClient from 'ra-data-graphql-simple';

export default () => {
    const client = new ApolloClient({
        networkInterface: createNetworkInterface({
            uri: 'http://localhost:4000/graphql',
        }),
    });

    const getGqlResource = resource => {
        switch (resource) {
            case 'customers':
                return 'Customer';

            case 'commands':
                return 'Command';

            case 'products':
                return 'Product';

            case 'reviews':
                return 'Review';

            default:
                throw new Error(`Unknown resource ${resource}`);
        }
    };

    return buildApolloClient({
        client,
    }).then(dataProvider => (type, resource, params) =>
        dataProvider(type, getGqlResource(resource), params)
    );
};
