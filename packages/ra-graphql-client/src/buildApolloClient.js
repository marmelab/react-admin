import { ApolloClient, createNetworkInterface } from 'apollo-client';

export default options => {
    if (!options) {
        return new ApolloClient();
    }

    const { uri, ...otherOptions } = options;

    if (uri) {
        return new ApolloClient({
            ...otherOptions,
            networkInterface: createNetworkInterface({ uri }),
        });
    }

    return new ApolloClient(options);
};
