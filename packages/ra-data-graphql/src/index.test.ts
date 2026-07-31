import {
    ApolloClient,
    CombinedGraphQLErrors,
    ServerError,
} from '@apollo/client';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';

import buildDataProvider, { BuildQueryFactory } from './index';

describe('GraphQL data provider', () => {
    describe('mutate', () => {
        describe('with error', () => {
            const buildDataProviderThrowing = (error: unknown) => {
                const mockClient = {
                    mutate: async () => {
                        throw error;
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
                return buildDataProvider({
                    client: mockClient as unknown as ApolloClient,
                    introspection: false,
                    buildQuery:
                        mockBuildQueryFactory as unknown as BuildQueryFactory,
                });
            };

            const update = dataProvider =>
                dataProvider.update('myResource', {
                    id: 1,
                    previousData: { id: 1 },
                    data: {},
                });

            it('sets the GraphQL errors in body', async () => {
                const dataProvider = buildDataProviderThrowing(
                    new CombinedGraphQLErrors({
                        errors: [new GraphQLError('some error')],
                    })
                );
                try {
                    await update(dataProvider);
                } catch (error) {
                    expect(error.status).toBe(200);
                    expect(error.body.graphQLErrors).toHaveLength(1);
                    expect(error.body.graphQLErrors[0].message).toBe(
                        'some error'
                    );
                    return;
                }
                fail('expected data provider to throw an error');
            });

            it('sets the status code of a server error', async () => {
                const dataProvider = buildDataProviderThrowing(
                    new ServerError('Service Unavailable', {
                        response: new Response('', { status: 503 }),
                        bodyText: '',
                    })
                );
                try {
                    await update(dataProvider);
                } catch (error) {
                    expect(error.status).toBe(503);
                    expect(error.message).toBe('Service Unavailable');
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
                query: jest.fn(() =>
                    Promise.resolve({
                        data: {
                            __schema: schema,
                        },
                    })
                ),
            };

            const dataProvider = buildDataProvider({
                client: client as unknown as ApolloClient,
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
