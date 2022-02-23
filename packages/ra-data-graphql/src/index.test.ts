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
                    client: (mockClient as unknown) as ApolloClient<unknown>,
                    introspection: false,
                    buildQuery: (mockBuildQueryFactory as unknown) as BuildQueryFactory,
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
});
