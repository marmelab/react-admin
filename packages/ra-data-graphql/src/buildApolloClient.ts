import {
    ApolloClient,
    ApolloClientOptions,
    HttpLink,
    InMemoryCache,
} from '@apollo/client';

export default (options: Partial<ApolloClientOptions<unknown>>) => {
    if (!options) {
        return new ApolloClient({
            cache: new InMemoryCache().restore({}),
        });
    }

    const {
        cache = new InMemoryCache().restore({}),
        uri,
        link = !!uri ? new HttpLink({ uri }) : undefined,
        ...otherOptions
    } = options;

    return new ApolloClient({
        link,
        cache,
        ...otherOptions,
    });
};
