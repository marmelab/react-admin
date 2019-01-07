import { TypeKind, print } from 'graphql';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    UPDATE,
    CREATE,
    DELETE,
} from 'ra-core';
import buildGqlQuery, {
    buildApolloArgs,
    buildArgs,
    buildFields,
    getArgType,
} from './buildGqlQuery';

describe('getArgType', () => {
    it('returns the arg type', () => {
        expect(
            print(getArgType({ type: { kind: TypeKind.SCALAR, name: 'foo' } }))
        ).toEqual('foo');
    });
    it('returns the arg type for NON_NULL types', () => {
        expect(
            print(
                getArgType({
                    type: {
                        kind: TypeKind.NON_NULL,
                        ofType: { name: 'ID', kind: TypeKind.SCALAR },
                    },
                })
            )
        ).toEqual('ID!');
    });
    it('returns the arg type for LIST types', () => {
        expect(
            print(
                getArgType({
                    type: {
                        kind: TypeKind.LIST,
                        ofType: { name: 'ID', kind: TypeKind.SCALAR },
                    },
                })
            )
        ).toEqual('[ID]');
    });
    it('returns the arg type for LIST types of NON_NULL type', () => {
        expect(
            print(
                getArgType({
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
                })
            )
        ).toEqual('[ID!]');
    });
});

describe('buildArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        expect(buildArgs({ args: [] })).toEqual([]);
    });

    it('returns an array of args correctly filtered when query has arguments', () => {
        expect(
            print(
                buildArgs(
                    { args: [{ name: 'foo' }, { name: 'bar' }] },
                    { foo: 'foo_value' }
                )
            )
        ).toEqual(['foo: $foo']);
    });
});

describe('buildApolloArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        expect(print(buildApolloArgs({ args: [] }))).toEqual([]);
    });

    it('returns an array of args correctly filtered when query has arguments', () => {
        expect(
            print(
                buildApolloArgs(
                    {
                        args: [
                            {
                                name: 'foo',
                                type: {
                                    kind: TypeKind.NON_NULL,
                                    ofType: {
                                        kind: TypeKind.SCALAR,
                                        name: 'Int',
                                    },
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
            )
        ).toEqual(['$foo: Int!', '$barId: ID', '$barIds: [ID!]']);
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
                            name: 'id',
                            type: { kind: TypeKind.SCALAR, name: 'ID' },
                        },
                    ],
                },
            ],
        };

        const fields = [
            { type: { kind: TypeKind.SCALAR, name: 'ID' }, name: 'id' },
            {
                type: { kind: TypeKind.SCALAR, name: '_internalField' },
                name: 'foo1',
            },
            {
                type: { kind: TypeKind.OBJECT, name: 'linkedType' },
                name: 'linked',
            },
            {
                type: { kind: TypeKind.OBJECT, name: 'resourceType' },
                name: 'resource',
            },
        ];

        expect(print(buildFields(introspectionResults)(fields))).toEqual([
            'id',
            `linked {
  id
}`,
            `resource {
  id
}`,
        ]);
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
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    GET_LIST,
                    queryType,
                    params
                )
            )
        ).toEqual(
            `query allCommand($foo: Int!) {
  items: allCommand(foo: $foo) {
    foo
    linked {
      foo
    }
    resource {
      id
    }
  }
  total: _allCommandMeta(foo: $foo) {
    count
  }
}
`
        );
    });
    it('returns the correct query for GET_MANY', () => {
        expect(
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    GET_MANY,
                    queryType,
                    params
                )
            )
        ).toEqual(
            `query allCommand($foo: Int!) {
  items: allCommand(foo: $foo) {
    foo
    linked {
      foo
    }
    resource {
      id
    }
  }
  total: _allCommandMeta(foo: $foo) {
    count
  }
}
`
        );
    });
    it('returns the correct query for GET_MANY_REFERENCE', () => {
        expect(
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    GET_MANY_REFERENCE,
                    queryType,
                    params
                )
            )
        ).toEqual(
            `query allCommand($foo: Int!) {
  items: allCommand(foo: $foo) {
    foo
    linked {
      foo
    }
    resource {
      id
    }
  }
  total: _allCommandMeta(foo: $foo) {
    count
  }
}
`
        );
    });
    it('returns the correct query for GET_ONE', () => {
        expect(
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    GET_ONE,
                    { ...queryType, name: 'getCommand' },
                    params
                )
            )
        ).toEqual(
            `query getCommand($foo: Int!) {
  data: getCommand(foo: $foo) {
    foo
    linked {
      foo
    }
    resource {
      id
    }
  }
}
`
        );
    });
    it('returns the correct query for UPDATE', () => {
        expect(
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    UPDATE,
                    { ...queryType, name: 'updateCommand' },
                    params
                )
            )
        ).toEqual(
            `mutation updateCommand($foo: Int!) {
  data: updateCommand(foo: $foo) {
    foo
    linked {
      foo
    }
    resource {
      id
    }
  }
}
`
        );
    });
    it('returns the correct query for CREATE', () => {
        expect(
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    CREATE,
                    { ...queryType, name: 'createCommand' },
                    params
                )
            )
        ).toEqual(
            `mutation createCommand($foo: Int!) {
  data: createCommand(foo: $foo) {
    foo
    linked {
      foo
    }
    resource {
      id
    }
  }
}
`
        );
    });
    it('returns the correct query for DELETE', () => {
        expect(
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    DELETE,
                    { ...queryType, name: 'deleteCommand' },
                    params
                )
            )
        ).toEqual(
            `mutation deleteCommand($foo: Int!) {
  data: deleteCommand(foo: $foo) {
    id
  }
}
`
        );
    });
});
