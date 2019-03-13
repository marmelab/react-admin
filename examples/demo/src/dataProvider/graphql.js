import buildApolloClient from 'ra-data-graphql-simple';

export default () => {
    const getGqlResource = resource => {
        switch (resource) {
            case 'customers':
                return 'Customer';

            case 'categories':
                return 'Category';

            case 'commands':
                return 'Command';

            case 'products':
                return 'Product';

            case 'reviews':
                return 'Review';

            case 'invoices':
                return 'Invoice';

            default:
                throw new Error(`Unknown resource ${resource}`);
        }
    };

    return buildApolloClient({
        clientOptions: {
            uri: 'http://localhost:4000/graphql',
        },
    }).then(dataProvider => (type, resource, params) =>
        dataProvider(type, getGqlResource(resource), params)
    );
};
