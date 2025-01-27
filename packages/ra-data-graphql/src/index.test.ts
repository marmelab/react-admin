import { ApolloClient, ApolloError } from '@apollo/client';
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
                query: vi.fn(() =>
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
