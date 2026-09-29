import {
    buildSchema,
    getIntrospectionQuery,
    graphqlSync,
    print,
    TypeKind,
} from 'graphql';
import { getGqlType } from './getGqlType';

describe('getGqlType', () => {
    it('returns the arg type', () => {
        expect(
            print(getGqlType({ kind: TypeKind.SCALAR, name: 'foo' }))
        ).toEqual('foo');
    });

    it('returns the arg type for NON_NULL types', () => {
        expect(
            print(
                getGqlType({
                    kind: TypeKind.NON_NULL,
                    ofType: { name: 'ID', kind: TypeKind.SCALAR },
                })
            )
        ).toEqual('ID!');
    });

    it('returns the arg type for LIST types', () => {
        expect(
            print(
                getGqlType({
                    kind: TypeKind.LIST,
                    ofType: { name: 'ID', kind: TypeKind.SCALAR },
                })
            )
        ).toEqual('[ID]');
    });

    it('returns the arg type for LIST with NON_NULL item types', () => {
        expect(
            print(
                getGqlType({
                    kind: TypeKind.LIST,
                    ofType: {
                        kind: TypeKind.NON_NULL,
                        ofType: {
                            kind: TypeKind.SCALAR,
                            name: 'ID',
                        },
                    },
                })
            )
        ).toEqual('[ID!]');
    });

    it('returns the arg type for NON_NULL LIST with nullable item type', () => {
        expect(
            print(
                getGqlType({
                    kind: TypeKind.NON_NULL,
                    ofType: {
                        kind: TypeKind.LIST,
                        ofType: {
                            kind: TypeKind.SCALAR,
                            name: 'ID',
                        },
                    },
                })
            )
        ).toEqual('[ID]!');
    });

    it('returns the arg type for NON_NULL LIST with NON_NULL items', () => {
        expect(
            print(
                getGqlType({
                    kind: TypeKind.NON_NULL,
                    ofType: {
                        kind: TypeKind.LIST,
                        ofType: {
                            kind: TypeKind.NON_NULL,
                            ofType: {
                                kind: TypeKind.SCALAR,
                                name: 'ID',
                            },
                        },
                    },
                })
            )
        ).toEqual('[ID!]!');
    });

    it('returns the arg type for nested LIST and NON_NULL items', () => {
        expect(
            print(
                getGqlType({
                    kind: TypeKind.NON_NULL,
                    ofType: {
                        kind: TypeKind.LIST,
                        ofType: {
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
                })
            )
        ).toEqual('[[ID!]]!');
    });

    it('returns the arg type for a named type carrying a null ofType', () => {
        expect(
            print(
                getGqlType({
                    kind: TypeKind.SCALAR,
                    name: 'foo',
                    ofType: null,
                })
            )
        ).toEqual('foo');
    });

    it('returns the arg type for wrapped types carrying a null ofType', () => {
        expect(
            print(
                getGqlType({
                    kind: TypeKind.NON_NULL,
                    name: null,
                    ofType: {
                        kind: TypeKind.LIST,
                        name: null,
                        ofType: {
                            kind: TypeKind.NON_NULL,
                            name: null,
                            ofType: {
                                kind: TypeKind.SCALAR,
                                name: 'ID',
                                ofType: null,
                            },
                        },
                    },
                })
            )
        ).toEqual('[ID!]!');
    });

    it('prints every argument type of a real introspection result', () => {
        const schema = buildSchema(`
            input CommandInput { id: ID }
            type Command { id: ID! }
            type Query {
                command(
                    id: ID!
                    tags: [String]
                    requiredTags: [String!]!
                    nested: [[Int!]]!
                    input: CommandInput
                ): Command
            }
        `);
        const introspection = graphqlSync({
            schema,
            source: getIntrospectionQuery(),
        });
        const types = (introspection.data as any).__schema.types;
        const args = types
            .find(type => type.name === 'Query')
            .fields.find(field => field.name === 'command').args;

        expect(
            Object.fromEntries(
                args.map(arg => [arg.name, print(getGqlType(arg.type))])
            )
        ).toEqual({
            id: 'ID!',
            tags: '[String]',
            requiredTags: '[String!]!',
            nested: '[[Int!]]!',
            input: 'CommandInput',
        });
    });
});
