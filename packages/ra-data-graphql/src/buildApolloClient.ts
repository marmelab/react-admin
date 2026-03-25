import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    type ApolloClientOptions,
} from '@apollo/client';

export default (options?: Partial<ApolloClientOptions<unknown>>) => {
    if (!options) {
        return new ApolloClient({
            cache: new InMemoryCache().restore({}),
            link: new HttpLink({}),
        });
    }

    const {
        cache = new InMemoryCache().restore({}),
        link,
        ...otherOptions
    } = options;

    return new ApolloClient({
        link,
        cache,
        ...otherOptions,
    });
};
