import gql from 'graphql-tag';
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
            () =>
                gql`
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
            { foo: true }
        );
        expect(getResponseParser).toHaveBeenCalledWith(
            'GET_LIST',
            resource,
            queryType
        );
    });
});
