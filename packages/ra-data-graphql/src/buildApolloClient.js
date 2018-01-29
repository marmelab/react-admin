import { ApolloClient } from 'apollo-client';
import { HttpLink, InMemoryCache } from 'apollo-client-preset';

export default options => {
    if (!options) {
        return new ApolloClient();
    }

    const { uri, ...otherOptions } = options;

    if (uri) {
        const link = new HttpLink({ uri });
        const cache = new InMemoryCache().restore({});

        return new ApolloClient({
            link,
            cache,
            ...otherOptions,
        });
    }

    return new ApolloClient(options);
};
