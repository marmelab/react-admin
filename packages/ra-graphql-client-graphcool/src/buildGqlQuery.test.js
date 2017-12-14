import { TypeKind } from 'graphql';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    UPDATE,
    CREATE,
    DELETE,
} from 'react-admin';
import buildGqlQuery, {
    buildApolloArgs,
    buildArgs,
    buildFields,
    getArgType,
} from './buildGqlQuery';

describe('getArgType', () => {
    it('returns the arg type name', () => {
        expect(
            getArgType({ type: { kind: TypeKind.SCALAR, name: 'foo' } })
        ).toEqual('foo');
    });
    it('returns the arg type name for NON_NULL types', () => {
        expect(
            getArgType({
                type: { kind: TypeKind.NON_NULL, ofType: { name: 'foo' } },
            })
        ).toEqual('foo!');
    });
});

describe('buildArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        expect(buildArgs({ args: [] })).toEqual({});
    });

    it('returns an array of args correctly filtered when query has arguments', () => {
        expect(
            buildArgs(
                { args: [{ name: 'foo' }, { name: 'bar' }] },
                { foo: 'foo_value' }
            )
        ).toEqual({ foo: '$foo' });
    });
});

describe('buildApolloArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        expect(buildApolloArgs({ args: [] })).toEqual({});
    });

    it('returns an array of args correctly filtered when query has arguments', () => {
        expect(
            buildApolloArgs(
                {
                    args: [
                        {
                            name: 'foo',
                            type: {
                                kind: TypeKind.NON_NULL,
                                ofType: { kind: TypeKind.SCALAR, name: 'Int' },
                            },
                        },
                        {
                            name: 'barId',
                            type: { kind: TypeKind.SCALAR, name: 'ID' },
                        },
                        {
                            name: 'barIds',
                            type: {
                                kind: TypeKind.LIST,
                                ofType: {
                                    kind: TypeKind.NON_NULL,
                                    ofType: {
                                        kind: TypeKind.SCALAR,
                                        name: 'ID',
                                    },
                                },
                            },
                        },
                        { name: 'bar' },
                    ],
                },
                { foo: 'foo_value', barId: 100, barIds: [101, 102] }
            )
        ).toEqual({ $foo: 'Int!', $barId: 'ID', $barIds: '[ID!]!' });
    });
});

describe('buildFields', () => {
    it('returns an object with the fields to retrieve', () => {
        const introspectionResults = {
            resources: [{ type: { name: 'resourceType' } }],
            types: [
                {
                    name: 'linkedType',
                    fields: [
                        {
                            name: 'foo',
                            type: { kind: TypeKind.SCALAR, name: 'bar' },
                        },
                    ],
                },
            ],
        };

        const fields = [
            { type: { kind: TypeKind.SCALAR, name: '' }, name: 'foo' },
            { type: { kind: TypeKind.SCALAR, name: '_foo' }, name: 'foo1' },
            {
                type: { kind: TypeKind.OBJECT, name: 'linkedType' },
                name: 'linked',
            },
            {
                type: { kind: TypeKind.OBJECT, name: 'resourceType' },
                name: 'resource',
            },
        ];

        expect(buildFields(introspectionResults)(fields)).toEqual({
            foo: {},
            linked: {
                fields: { foo: {} },
            },
            resource: {
                fields: { id: {} },
            },
        });
    });
});

describe('buildGqlQuery', () => {
    const introspectionResults = {
        resources: [{ type: { name: 'resourceType' } }],
        types: [
            {
                name: 'linkedType',
                fields: [
                    {
                        name: 'foo',
                        type: { kind: TypeKind.SCALAR, name: 'bar' },
                    },
                ],
            },
        ],
    };

    const resource = {
        type: {
            fields: [
                { type: { kind: TypeKind.SCALAR, name: '' }, name: 'foo' },
                { type: { kind: TypeKind.SCALAR, name: '_foo' }, name: 'foo1' },
                {
                    type: { kind: TypeKind.OBJECT, name: 'linkedType' },
                    name: 'linked',
                },
                {
                    type: { kind: TypeKind.OBJECT, name: 'resourceType' },
                    name: 'resource',
                },
            ],
        },
    };

    const queryType = {
        name: 'allCommand',
        args: [
            {
                name: 'foo',
                type: {
                    kind: TypeKind.NON_NULL,
                    ofType: { kind: TypeKind.SCALAR, name: 'Int' },
                },
            },
            {
                name: 'barId',
                type: { kind: TypeKind.SCALAR },
            },
            {
                name: 'barIds',
                type: { kind: TypeKind.SCALAR },
            },
            { name: 'bar' },
        ],
    };
    const params = { foo: 'foo_value' };

    it('returns the correct query for GET_LIST', () => {
        expect(
            buildGqlQuery(introspectionResults)(
                resource,
                GET_LIST,
                queryType,
                params
            )
        ).toEqual(
            'query allCommand($foo:Int!){items:allCommand(foo:$foo){foo,linked{foo},resource{id}},total:_allCommandMeta(foo:$foo){count}}'
        );
    });
    it('returns the correct query for GET_MANY', () => {
        expect(
            buildGqlQuery(introspectionResults)(
                resource,
                GET_MANY,
                queryType,
                params
            )
        ).toEqual(
            'query allCommand($foo:Int!){items:allCommand(foo:$foo){foo,linked{foo},resource{id}},total:_allCommandMeta(foo:$foo){count}}'
        );
    });
    it('returns the correct query for GET_MANY_REFERENCE', () => {
        expect(
            buildGqlQuery(introspectionResults)(
                resource,
                GET_MANY_REFERENCE,
                queryType,
                params
            )
        ).toEqual(
            'query allCommand($foo:Int!){items:allCommand(foo:$foo){foo,linked{foo},resource{id}},total:_allCommandMeta(foo:$foo){count}}'
        );
    });
    it('returns the correct query for GET_ONE', () => {
        expect(
            buildGqlQuery(introspectionResults)(
                resource,
                GET_ONE,
                { ...queryType, name: 'getCommand' },
                params
            )
        ).toEqual(
            'query getCommand($foo:Int!){data:getCommand(foo:$foo){foo,linked{foo},resource{id}}}'
        );
    });
    it('returns the correct query for UPDATE', () => {
        expect(
            buildGqlQuery(introspectionResults)(
                resource,
                UPDATE,
                { ...queryType, name: 'updateCommand' },
                params
            )
        ).toEqual(
            'mutation updateCommand($foo:Int!){data:updateCommand(foo:$foo){foo,linked{foo},resource{id}}}'
        );
    });
    it('returns the correct query for CREATE', () => {
        expect(
            buildGqlQuery(introspectionResults)(
                resource,
                CREATE,
                { ...queryType, name: 'createCommand' },
                params
            )
        ).toEqual(
            'mutation createCommand($foo:Int!){data:createCommand(foo:$foo){foo,linked{foo},resource{id}}}'
        );
    });
    it('returns the correct query for DELETE', () => {
        expect(
            buildGqlQuery(introspectionResults)(
                resource,
                DELETE,
                { ...queryType, name: 'deleteCommand' },
                params
            )
        ).toEqual(
            'mutation deleteCommand($foo:Int!){data:deleteCommand(foo:$foo){id}}'
        );
    });
});
