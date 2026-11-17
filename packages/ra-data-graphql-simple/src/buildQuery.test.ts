import { gql } from '@apollo/client';
import { print } from 'graphql';
import { buildQueryFactory } from './buildQuery';

describe('buildQuery', () => {
    const queryType = 'query_type';

    const resource = {
        type: { name: 'Post' },
        GET_LIST: queryType,
    };
    const introspectionResults = {
        resources: [resource],
    };

    it('throws an error if resource is unknown', () => {
        expect(() =>
            buildQueryFactory()(introspectionResults)('GET_LIST', 'Comment')
        ).toThrow(
            'Unknown resource Comment. Make sure it has been declared on your server side schema. Known resources are Post'
        );
    });

    it('throws an error if resource does not have a query or mutation for specified AOR fetch type', () => {
        expect(() =>
            buildQueryFactory()(introspectionResults)('CREATE', 'Post')
        ).toThrow(
            'No query or mutation matching fetch type CREATE could be found for resource Post'
        );
    });

    it('correctly builds a query and returns it along with variables and parseResponse', () => {
        const buildVariables = jest.fn(() => ({ foo: true }));
        const buildGqlQuery = jest.fn(
            () => gql`
                query {
                    id
                }
            `
        );
        const getResponseParser = jest.fn(() => 'parseResponseFunction');
        const buildVariablesFactory = jest.fn(() => buildVariables);
        const buildGqlQueryFactory = jest.fn(() => buildGqlQuery);
        const getResponseParserFactory = jest.fn(() => getResponseParser);

        expect(
            buildQueryFactory(
                buildVariablesFactory,
                buildGqlQueryFactory,
                getResponseParserFactory
            )(introspectionResults)('GET_LIST', 'Post', { foo: 'bar' })
        ).toEqual({
            query: gql`
                query {
                    id
                }
            `,
            variables: { foo: true },
            parseResponse: 'parseResponseFunction',
        });

        expect(buildVariablesFactory).toHaveBeenCalledWith(
            introspectionResults
        );
        expect(buildGqlQueryFactory).toHaveBeenCalledWith(introspectionResults);
        expect(getResponseParserFactory).toHaveBeenCalledWith(
            introspectionResults
        );

        expect(buildVariables).toHaveBeenCalledWith(
            resource,
            'GET_LIST',
            { foo: 'bar' },
            queryType
        );
        expect(buildGqlQuery).toHaveBeenCalledWith(
            resource,
            'GET_LIST',
            queryType,
            { foo: true },
            { sparseFields: undefined }
        );
        expect(getResponseParser).toHaveBeenCalledWith(
            'GET_LIST',
            resource,
            queryType
        );
    });

    describe('with a resource having a field named meta', () => {
        const scalar = name => ({ kind: 'SCALAR', name });
        const userType = {
            name: 'User',
            fields: [
                { name: 'id', type: scalar('ID') },
                { name: 'email', type: scalar('String') },
            ],
        };
        const postResource = {
            type: {
                name: 'Post',
                fields: [
                    { name: 'id', type: scalar('ID') },
                    { name: 'title', type: scalar('String') },
                    { name: 'meta', type: scalar('JSON') },
                    { name: 'User', type: { kind: 'OBJECT', name: 'User' } },
                ],
            },
            UPDATE: {
                name: 'updatePost',
                args: [
                    { name: 'id', type: scalar('ID') },
                    { name: 'title', type: scalar('String') },
                    { name: 'meta', type: scalar('JSON') },
                ],
            },
        };
        const buildQuery = buildQueryFactory()({
            types: [userType, postResource.type],
            resources: [postResource, { type: userType }],
        } as any);
        const data = {
            id: 1,
            title: 'foo',
            meta: { sparseFields: ['id', { User: ['id', 'email'] }] },
        };

        it('does not read the sparse fields from the record', () => {
            const { query, variables } = buildQuery('UPDATE', 'Post', {
                id: 1,
                data,
            });
            expect(print(query)).toEqual(
                print(gql`
                    mutation updatePost($id: ID, $title: String, $meta: JSON) {
                        data: updatePost(id: $id, title: $title, meta: $meta) {
                            id
                            title
                            meta
                            User {
                                id
                            }
                        }
                    }
                `)
            );
            expect(variables.meta).toEqual(data.meta);
        });

        it('reads the sparse fields from the meta param', () => {
            const { query, variables } = buildQuery('UPDATE', 'Post', {
                id: 1,
                data,
                meta: { sparseFields: ['id'] },
            });
            expect(print(query)).toEqual(
                print(gql`
                    mutation updatePost($id: ID, $title: String, $meta: JSON) {
                        data: updatePost(id: $id, title: $title, meta: $meta) {
                            id
                        }
                    }
                `)
            );
            expect(variables.meta).toEqual(data.meta);
        });
    });
});
