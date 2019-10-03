import { ApolloClient } from 'apollo-client';
import {
    HttpLink,
    InMemoryCache,
    IntrospectionFragmentMatcher,
} from 'apollo-client-preset';

export default options => {
    if (!options) {
        return new ApolloClient();
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
        finalCache = new InMemoryCache({ fragmentMatcher }).restore({});
    }

    return new ApolloClient({
        link: finalLink,
        cache: finalCache,
        ...otherOptions,
    });
};
