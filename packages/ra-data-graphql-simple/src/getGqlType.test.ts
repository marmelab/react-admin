import { TypeKind, print } from 'graphql';
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
});
