import { ApolloClient } from 'apollo-client';
import { HttpLink, InMemoryCache } from 'apollo-client-preset';

export default options => {
    if (!options) {
        return new ApolloClient();
    }

    const { cache, link, uri, ...otherOptions } = options;
    let finalLink = link;
    let finalCache = cache;

    if (!link && uri) {
        finalLink = new HttpLink({ uri });
    }

    if (!cache) {
        finalCache = new InMemoryCache().restore({});
    }

    return new ApolloClient({
        link: finalLink,
        cache: finalCache,
        ...otherOptions,
    });
};
