import { TypeKind, print } from 'graphql';
import { gql } from '@apollo/client';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    UPDATE,
    CREATE,
    DELETE,
    DELETE_MANY,
    UPDATE_MANY,
} from 'ra-core';

import buildGqlQuery, {
    buildApolloArgs,
    buildArgs,
    buildFields,
} from './buildGqlQuery';

describe('buildArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        expect(buildArgs({ args: [] }, {})).toEqual([]);
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
        expect(print(buildApolloArgs({ args: [] }, {}))).toEqual([]);
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

function buildGQLParamsWithSparseFieldsFactory() {
    const introspectionResults = {
        resources: [
            {
                type: {
                    name: 'resourceType',
                    fields: [
                        {
                            name: 'id',
                            type: { kind: TypeKind.SCALAR, name: 'ID' },
                        },
                        {
                            name: 'name',
                            type: { kind: TypeKind.SCALAR, name: 'String' },
                        },
                        {
                            name: 'foo',
                            type: { kind: TypeKind.SCALAR, name: 'String' },
                        },
                    ],
                },
            },
        ],
        types: [
            {
                name: 'linkedType',
                fields: [
                    {
                        name: 'id',
                        type: { kind: TypeKind.SCALAR, name: 'ID' },
                    },
                    {
                        name: 'title',
                        type: { kind: TypeKind.SCALAR, name: 'String' },
                    },
                    {
                        name: 'nestedLink',
                        type: {
                            kind: TypeKind.OBJECT,
                            name: 'nestedLinkedType',
                        },
                    },
                ],
            },
            {
                name: 'nestedLinkedType',
                fields: [
                    {
                        name: 'id',
                        type: { kind: TypeKind.SCALAR, name: 'ID' },
                    },
                    {
                        name: 'bar',
                        type: { kind: TypeKind.SCALAR, name: 'String' },
                    },
                ],
            },
        ],
    };

    const resource = {
        type: {
            fields: [
                { type: { kind: TypeKind.SCALAR, name: 'ID' }, name: 'id' },
                {
                    type: { kind: TypeKind.SCALAR, name: 'String' },
                    name: 'address',
                },
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
        ],
    };

    const params = {
        foo: 'foo_value',
        meta: {
            sparseFields: [
                'address',
                { linked: ['title'] },
                { resource: ['foo', 'name'] },
            ],
        },
    };

    return {
        introspectionResults,
        queryType,
        params,
        resource,
    };
}

describe('buildFields', () => {
    it('returns an object with the fields to retrieve', () => {
        const introspectionResults = {
            resources: [
                {
                    type: {
                        name: 'resourceType',
                        fields: [
                            {
                                name: 'id',
                                type: { kind: TypeKind.SCALAR, name: 'ID' },
                            },
                        ],
                    },
                },
            ],
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

    describe('with sparse fields', () => {
        it('returns an object with the fields to retrieve', () => {
            const {
                introspectionResults,
                resource,
                params,
            } = buildGQLParamsWithSparseFieldsFactory();

            // nested sparse params
            params.meta.sparseFields[1].linked.push({ nestedLink: ['bar'] });

            expect(
                print(
                    buildFields(introspectionResults)(
                        resource.type.fields,
                        params.meta.sparseFields
                    )
                )
            ).toEqual([
                'address',
                `linked {
  title
  nestedLink {
    bar
  }
}`,
                `resource {
  foo
  name
}`,
            ]);
        });

        it('throws an error when sparse fields is requested but empty', () => {
            const {
                introspectionResults,
                resource,
            } = buildGQLParamsWithSparseFieldsFactory();

            expect(() =>
                buildFields(introspectionResults)(resource.type.fields, [])
            ).toThrowError(
                "Empty sparse fields. Specify at least one field or remove the 'sparseFields' param"
            );
        });

        it('throws an error when requested sparse fields are not available', () => {
            const {
                introspectionResults,
                resource,
            } = buildGQLParamsWithSparseFieldsFactory();

            expect(() =>
                buildFields(introspectionResults)(resource.type.fields, [
                    'unavailbleField',
                ])
            ).toThrowError(
                "Requested sparse fields not found. Ensure sparse fields are available in the resource's type"
            );
        });
    });
});

describe('buildFieldsWithCircularDependency', () => {
    it('returns an object with the fields to retrieve', () => {
        const introspectionResults = {
            resources: [
                {
                    type: {
                        name: 'resourceType',
                        fields: [
                            {
                                name: 'id',
                                type: { kind: TypeKind.SCALAR, name: 'ID' },
                            },
                        ],
                    },
                },
            ],
            types: [
                {
                    name: 'linkedType',
                    fields: [
                        {
                            name: 'id',
                            type: { kind: TypeKind.SCALAR, name: 'ID' },
                        },
                        {
                            name: 'child',
                            type: { kind: TypeKind.OBJECT, name: 'linkedType' },
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

describe('buildFieldsWithSameType', () => {
    it('returns an object with the fields to retrieve', () => {
        const introspectionResults = {
            resources: [
                {
                    type: {
                        name: 'resourceType',
                        fields: [
                            {
                                name: 'id',
                                type: { kind: TypeKind.SCALAR, name: 'ID' },
                            },
                        ],
                    },
                },
            ],
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
                type: { kind: TypeKind.OBJECT, name: 'linkedType' },
                name: 'anotherLinked',
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
            `anotherLinked {
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
        resources: [
            {
                type: {
                    name: 'resourceType',
                    fields: [
                        {
                            name: 'id',
                            type: { kind: TypeKind.SCALAR, name: 'ID' },
                        },
                    ],
                },
            },
        ],
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

    const queryTypeDeleteMany = {
        name: 'deleteCommands',
        args: [
            {
                name: 'ids',
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
        ],
    };

    const queryTypeUpdateMany = {
        name: 'updateCommands',
        args: [
            {
                name: 'ids',
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
            {
                name: 'data',
                type: { kind: TypeKind.OBJECT, name: 'CommandType' },
            },
        ],
    };

    const params = { foo: 'foo_value' };

    describe('GET_LIST', () => {
        it('returns the correct query', () => {
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
                print(gql`
                    query allCommand($foo: Int!) {
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
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const {
                introspectionResults,
                params,
                queryType,
                resource,
            } = buildGQLParamsWithSparseFieldsFactory();

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
                print(gql`
                    query allCommand($foo: Int!) {
                        items: allCommand(foo: $foo) {
                            address
                            linked {
                                title
                            }
                            resource {
                                foo
                                name
                            }
                        }
                        total: _allCommandMeta(foo: $foo) {
                            count
                        }
                    }
                `)
            );
        });
    });
    describe('GET_MANY', () => {
        it('returns the correct query', () => {
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
                print(gql`
                    query allCommand($foo: Int!) {
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
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const {
                introspectionResults,
                params,
                queryType,
                resource,
            } = buildGQLParamsWithSparseFieldsFactory();

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
                print(gql`
                    query allCommand($foo: Int!) {
                        items: allCommand(foo: $foo) {
                            address
                            linked {
                                title
                            }
                            resource {
                                foo
                                name
                            }
                        }
                        total: _allCommandMeta(foo: $foo) {
                            count
                        }
                    }
                `)
            );
        });
    });

    describe('GET_MANY_REFERENCE', () => {
        it('returns the correct query', () => {
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
                print(gql`
                    query allCommand($foo: Int!) {
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
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const {
                introspectionResults,
                params,
                queryType,
                resource,
            } = buildGQLParamsWithSparseFieldsFactory();

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
                print(gql`
                    query allCommand($foo: Int!) {
                        items: allCommand(foo: $foo) {
                            address
                            linked {
                                title
                            }
                            resource {
                                foo
                                name
                            }
                        }
                        total: _allCommandMeta(foo: $foo) {
                            count
                        }
                    }
                `)
            );
        });
    });
    describe('GET_ONE', () => {
        it('returns the correct query', () => {
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
                print(gql`
                    query getCommand($foo: Int!) {
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
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const {
                introspectionResults,
                params,
                queryType,
                resource,
            } = buildGQLParamsWithSparseFieldsFactory();

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
                print(gql`
                    query getCommand($foo: Int!) {
                        data: getCommand(foo: $foo) {
                            address
                            linked {
                                title
                            }
                            resource {
                                foo
                                name
                            }
                        }
                    }
                `)
            );
        });
    });
    describe('UPDATE', () => {
        it('returns the correct query', () => {
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
                print(gql`
                    mutation updateCommand($foo: Int!) {
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
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const {
                introspectionResults,
                params,
                queryType,
                resource,
            } = buildGQLParamsWithSparseFieldsFactory();

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
                print(gql`
                    mutation updateCommand($foo: Int!) {
                        data: updateCommand(foo: $foo) {
                            address
                            linked {
                                title
                            }
                            resource {
                                foo
                                name
                            }
                        }
                    }
                `)
            );
        });
    });
    describe('CREATE', () => {
        it('returns the correct query', () => {
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
                print(gql`
                    mutation createCommand($foo: Int!) {
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
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const {
                introspectionResults,
                params,
                queryType,
                resource,
            } = buildGQLParamsWithSparseFieldsFactory();

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
                print(gql`
                    mutation createCommand($foo: Int!) {
                        data: createCommand(foo: $foo) {
                            address
                            linked {
                                title
                            }
                            resource {
                                foo
                                name
                            }
                        }
                    }
                `)
            );
        });
    });
    describe('DELETE', () => {
        it('returns the correct query', () => {
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
                print(gql`
                    mutation deleteCommand($foo: Int!) {
                        data: deleteCommand(foo: $foo) {
                            foo
                            linked {
                                foo
                            }
                            resource {
                                id
                            }
                        }
                    }
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const {
                introspectionResults,
                params,
                queryType,
                resource,
            } = buildGQLParamsWithSparseFieldsFactory();

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
                print(gql`
                    mutation deleteCommand($foo: Int!) {
                        data: deleteCommand(foo: $foo) {
                            address
                            linked {
                                title
                            }
                            resource {
                                foo
                                name
                            }
                        }
                    }
                `)
            );
        });
    });

    it('returns the correct query for DELETE_MANY', () => {
        expect(
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    DELETE_MANY,
                    queryTypeDeleteMany,
                    { ids: [1, 2, 3] }
                )
            )
        ).toEqual(
            `mutation deleteCommands($ids: [ID!]) {
  data: deleteCommands(ids: $ids) {
    ids
  }
}
`
        );
    });

    it('returns the correct query for UPDATE_MANY', () => {
        expect(
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    UPDATE_MANY,
                    queryTypeUpdateMany,
                    {
                        ids: [1, 2, 3],
                        data: params,
                    }
                )
            )
        ).toEqual(
            `mutation updateCommands($ids: [ID!], $data: CommandType) {
  data: updateCommands(ids: $ids, data: $data) {
    ids
  }
}
`
        );
    });
});
