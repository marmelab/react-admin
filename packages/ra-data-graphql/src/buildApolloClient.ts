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
        credentials,
        headers,
        link = !!uri ? new HttpLink({ uri, credentials, headers }) : undefined,
        ...otherOptions
    } = options;

    return new ApolloClient({
        link,
        cache,
        ...otherOptions,
    });
};
