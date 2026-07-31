import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    type ApolloClientOptions,
} from '@apollo/client';

/**
 * Apollo Client 4 moved `uri`, `credentials` and `headers` out of the client
 * options: they are HttpLink options now. We keep accepting them here and
 * forward them to the HttpLink we build, so that
 * `buildGraphQLProvider({ clientOptions: { uri } })` keeps working.
 */
export type BuildApolloClientOptions = Partial<ApolloClientOptions> &
    Pick<HttpLink.Options, 'uri' | 'credentials' | 'headers'>;

export default (options?: BuildApolloClientOptions) => {
    if (!options) {
        return new ApolloClient({
            cache: new InMemoryCache().restore({}),
            link: new HttpLink({}),
        });
    }

    const {
        cache = new InMemoryCache().restore({}),
        uri,
        credentials,
        headers,
        link = new HttpLink({ uri, credentials, headers }),
        ...otherOptions
    } = options;

    return new ApolloClient({
        link,
        cache,
        ...otherOptions,
    });
};
