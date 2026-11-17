import {
    ApolloClient,
    ApolloError,
    ApolloLink,
    InMemoryCache,
    Observable,
} from '@apollo/client';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';

import buildDataProvider, { BuildQueryFactory } from './index';

describe('GraphQL data provider', () => {
    describe('mutate', () => {
        describe('with error', () => {
            it('sets ApolloError in body', async () => {
                const mockClient = {
                    mutate: async () => {
                        throw new ApolloError({
                            graphQLErrors: [new GraphQLError('some error')],
                        });
                    },
                };
                const mockBuildQueryFactory = () => {
                    return () => ({
                        query: gql`
                            mutation {
                                updateMyResource {
                                    result
                                }
                            }
                        `,
                        parseResponse: () => ({}),
                    });
                };
                const dataProvider = await buildDataProvider({
                    client: mockClient as unknown as ApolloClient<unknown>,
                    introspection: false,
                    buildQuery:
                        mockBuildQueryFactory as unknown as BuildQueryFactory,
                });
                try {
                    await dataProvider.update('myResource', {
                        id: 1,
                        previousData: { id: 1 },
                        data: {},
                    });
                } catch (error) {
                    expect(error.body).not.toBeNull();
                    expect(error.body.graphQLErrors).toBeDefined();
                    expect(error.body.graphQLErrors).toHaveLength(1);
                    return;
                }
                fail('expected data provider to throw an error');
            });
        });
    });
    describe('query', () => {
        it('sends a request for each query, even when an identical query is in flight', async () => {
            const sendResponses: (() => void)[] = [];
            const link = new ApolloLink(
                () =>
                    new Observable(observer => {
                        const request = sendResponses.length + 1;
                        sendResponses.push(() => {
                            observer.next({ data: { request } });
                            observer.complete();
                        });
                    })
            );
            const dataProvider = buildDataProvider({
                client: new ApolloClient({ link, cache: new InMemoryCache() }),
                introspection: false,
                buildQuery: () => () => ({
                    query: gql`
                        query {
                            request
                        }
                    `,
                    parseResponse: response => ({ data: response.data }),
                }),
            });
            const firstResponse = dataProvider.getOne('posts', { id: 1 });
            await new Promise(resolve => setTimeout(resolve));
            const secondResponse = dataProvider.getOne('posts', { id: 1 });
            await new Promise(resolve => setTimeout(resolve));
            expect(sendResponses).toHaveLength(2);
            sendResponses.forEach(sendResponse => sendResponse());
            expect(await firstResponse).toEqual({ data: { request: 1 } });
            expect(await secondResponse).toEqual({ data: { request: 2 } });
        });
    });
    describe('getIntrospection', () => {
        it('returns introspection result', async () => {
            const schema = {
                queryType: { name: 'Query' },
                mutationType: { name: 'Mutation' },
                types: [
                    {
                        name: 'Query',
                        fields: [{ name: 'allPosts' }, { name: 'Post' }],
                    },
                    {
                        name: 'Mutation',
                        fields: [
                            { name: 'createPost' },
                            { name: 'updatePost' },
                            { name: 'deletePost' },
                        ],
                    },
                    { name: 'Post' },
                ],
            };
            const client = {
                query: jest.fn(() =>
                    Promise.resolve({
                        data: {
                            __schema: schema,
                        },
                    })
                ),
            };

            const dataProvider = buildDataProvider({
                client: client as unknown as ApolloClient<unknown>,
                buildQuery: () => () => undefined,
            });

            const introspection = await dataProvider.getIntrospection();
            expect(introspection).toEqual({
                queries: [
                    { name: 'allPosts' },
                    { name: 'Post' },
                    { name: 'createPost' },
                    { name: 'updatePost' },
                    { name: 'deletePost' },
                ],
                types: [{ name: 'Post' }],
                resources: [
                    {
                        type: { name: 'Post' },
                        GET_LIST: { name: 'allPosts' },
                        GET_MANY: { name: 'allPosts' },
                        GET_MANY_REFERENCE: { name: 'allPosts' },
                        GET_ONE: { name: 'Post' },
                        CREATE: { name: 'createPost' },
                        UPDATE: { name: 'updatePost' },
                        DELETE: { name: 'deletePost' },
                    },
                ],
                schema,
            });
        });
    });
});
