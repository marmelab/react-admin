import { HttpLink } from '@apollo/client';
import gql from 'graphql-tag';

import buildApolloClient from './buildApolloClient';

const okResponse = () =>
    Promise.resolve(
        new Response(JSON.stringify({ data: { foo: 'bar' } }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        })
    );

describe('buildApolloClient', () => {
    let fetchSpy;

    beforeEach(() => {
        fetchSpy = jest
            .spyOn(globalThis, 'fetch')
            .mockImplementation(okResponse as any);
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    const runQuery = async client => {
        await client.query({
            query: gql`
                query {
                    foo
                }
            `,
            fetchPolicy: 'no-cache',
        });
        return fetchSpy.mock.calls[0];
    };

    it('sends the query to the uri passed in options', async () => {
        const client = buildApolloClient({
            uri: 'http://example.com/graphql',
        });

        const [url] = await runQuery(client);

        expect(String(url)).toBe('http://example.com/graphql');
    });

    it('forwards credentials and headers to the HttpLink', async () => {
        const client = buildApolloClient({
            uri: 'http://example.com/graphql',
            credentials: 'include',
            headers: { 'X-Custom': 'yes' },
        });

        const [, init] = await runQuery(client);

        expect(init.credentials).toBe('include');
        expect(new Headers(init.headers).get('X-Custom')).toBe('yes');
    });

    it('lets an explicit link take precedence over uri', async () => {
        const client = buildApolloClient({
            uri: 'http://ignored.example.com/graphql',
            link: new HttpLink({ uri: 'http://explicit.example.com/graphql' }),
        });

        const [url] = await runQuery(client);

        expect(String(url)).toBe('http://explicit.example.com/graphql');
    });

    it('builds a client without any options', () => {
        expect(buildApolloClient().link).toBeDefined();
    });
});
