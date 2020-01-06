import { ApolloClient, ApolloClientOptions } from 'apollo-client';
import {
    HttpLink,
    InMemoryCache,
    IntrospectionFragmentMatcher,
} from 'apollo-client-preset';
import { ApolloCache } from 'apollo-cache';
import { UriFunction } from 'apollo-link-http-common';

export interface BuildClientOptions<TCacheShape>
    extends Omit<ApolloClientOptions<TCacheShape>, 'cache'> {
    uri?: string | UriFunction;
    cache?: ApolloCache<TCacheShape>;
}

export default <TCacheShape>(
    options?: BuildClientOptions<TCacheShape>
): ApolloClient<TCacheShape> => {
    if (!options) {
        return new (ApolloClient as any)();
    }

    const { cache, link, uri, ...otherOptions } = options;
    let finalLink = link;
    let finalCache = cache;

    // Create an empty fragment matcher
    // See: https://github.com/apollographql/apollo-client/issues/3397#issuecomment-421433032
    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData: {
            __schema: {
                types: [],
            },
        },
    });

    if (!link && uri) {
        finalLink = new HttpLink({ uri });
    }

    if (!cache) {
        finalCache = new InMemoryCache({ fragmentMatcher }).restore({}) as any;
    }

    return new ApolloClient({
        link: finalLink,
        cache: finalCache,
        ...otherOptions,
    });
};
