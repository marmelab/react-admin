import { TypeKind } from 'graphql';
import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
} from 'ra-core';
import getResponseParser from './getResponseParser';

describe('getResponseParser', () => {
    it.each([[GET_LIST], [GET_MANY], [GET_MANY_REFERENCE]])(
        'returns the response expected for %s',
        type => {
            const introspectionResults = {
                resources: [
                    {
                        type: {
                            name: 'User',
                            fields: [
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'firstName',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                    {
                        type: {
                            name: 'Tag',
                            fields: [
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'name',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                ],
                types: [{ name: 'User' }, { name: 'Tag' }],
            };
            const response = {
                data: {
                    items: [
                        {
                            _typeName: 'Post',
                            id: 'post1',
                            title: 'title1',
                            author: { id: 'author1', firstName: 'Toto' },
                            coauthor: null,
                            tags: [
                                { id: 'tag1', name: 'tag1 name' },
                                { id: 'tag2', name: 'tag2 name' },
                            ],
                            embeddedJson: { foo: 'bar' },
                        },
                        {
                            _typeName: 'Post',
                            id: 'post2',
                            title: 'title2',
                            author: { id: 'author1', firstName: 'Toto' },
                            coauthor: null,
                            tags: [
                                { id: 'tag1', name: 'tag1 name' },
                                { id: 'tag3', name: 'tag3 name' },
                            ],
                            embeddedJson: { foo: 'bar' },
                        },
                    ],
                    total: { count: 100 },
                },
            };

            expect(
                getResponseParser(introspectionResults)(
                    type,
                    undefined,
                    undefined
                )(response)
            ).toEqual({
                data: [
                    {
                        id: 'post1',
                        title: 'title1',
                        'author.id': 'author1',
                        author: { id: 'author1', firstName: 'Toto' },
                        tags: [
                            { id: 'tag1', name: 'tag1 name' },
                            { id: 'tag2', name: 'tag2 name' },
                        ],
                        tagsIds: ['tag1', 'tag2'],
                        embeddedJson: { foo: 'bar' },
                    },
                    {
                        id: 'post2',
                        title: 'title2',
                        'author.id': 'author1',
                        author: { id: 'author1', firstName: 'Toto' },
                        tags: [
                            { id: 'tag1', name: 'tag1 name' },
                            { id: 'tag3', name: 'tag3 name' },
                        ],
                        tagsIds: ['tag1', 'tag3'],
                        embeddedJson: { foo: 'bar' },
                    },
                ],
                total: 100,
            });
        }
    );

    describe.each([[CREATE], [UPDATE], [DELETE]])('%s', type => {
        it(`returns the response expected for ${type}`, () => {
            const introspectionResults = {
                resources: [
                    {
                        type: {
                            name: 'User',
                            fields: [
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'firstName',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                    {
                        type: {
                            name: 'Tag',
                            fields: [
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'name',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                ],
                types: [{ name: 'User' }, { name: 'Tag' }],
            };
            const response = {
                data: {
                    data: {
                        _typeName: 'Post',
                        id: 'post1',
                        title: 'title1',
                        author: { id: 'author1', firstName: 'Toto' },
                        coauthor: null,
                        tags: [
                            { id: 'tag1', name: 'tag1 name' },
                            { id: 'tag2', name: 'tag2 name' },
                        ],
                        embeddedJson: { foo: 'bar' },
                    },
                },
            };
            expect(
                getResponseParser(introspectionResults)(
                    type,
                    undefined,
                    undefined
                )(response)
            ).toEqual({
                data: {
                    id: 'post1',
                    title: 'title1',
                    'author.id': 'author1',
                    author: { id: 'author1', firstName: 'Toto' },
                    tags: [
                        { id: 'tag1', name: 'tag1 name' },
                        { id: 'tag2', name: 'tag2 name' },
                    ],
                    tagsIds: ['tag1', 'tag2'],
                    embeddedJson: { foo: 'bar' },
                },
            });
        });

        it(`returns the response expected for ${type} with simple arrays of values`, () => {
            const introspectionResults = {
                resources: [
                    {
                        type: {
                            name: 'User',
                            fields: [
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'firstName',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                    {
                        type: {
                            name: 'Tag',
                            fields: [
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'name',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                ],
                types: [{ name: 'User' }, { name: 'Tag' }],
            };
            const response = {
                data: {
                    data: {
                        _typeName: 'Post',
                        id: 'post1',
                        title: 'title1',
                        author: { id: 'author1', firstName: 'Toto' },
                        coauthor: null,
                        tags: [
                            { id: 'tag1', name: 'tag1 name' },
                            { id: 'tag2', name: 'tag2 name' },
                        ],
                        features: ['feature1', 'feature2'],
                        embeddedJson: { foo: 'bar' },
                    },
                },
            };
            expect(
                getResponseParser(introspectionResults)(
                    type,
                    undefined,
                    undefined
                )(response)
            ).toEqual({
                data: {
                    id: 'post1',
                    title: 'title1',
                    'author.id': 'author1',
                    author: { id: 'author1', firstName: 'Toto' },
                    tags: [
                        { id: 'tag1', name: 'tag1 name' },
                        { id: 'tag2', name: 'tag2 name' },
                    ],
                    features: ['feature1', 'feature2'],
                    tagsIds: ['tag1', 'tag2'],
                    embeddedJson: { foo: 'bar' },
                },
            });
        });

        it(`returns the response expected for ${type} with aliases`, () => {
            const introspectionResults = {
                resources: [
                    {
                        type: {
                            name: 'User',
                            fields: [
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'firstName',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                    {
                        type: {
                            name: 'Tag',
                            fields: [
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'name',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                ],
                types: [{ name: 'User' }, { name: 'Tag' }],
            };
            const response = {
                data: {
                    data: {
                        _typeName: 'Post',
                        id: 'post1',
                        aliasTitle: 'title1',
                        author: { id: 'author1', firstName: 'Toto' },
                        coauthor: null,
                        tags: [
                            { id: 'tag1', name: 'tag1 name' },
                            { id: 'tag2', name: 'tag2 name' },
                        ],
                        embeddedJson: { foo: 'bar' },
                    },
                },
            };

            expect(
                getResponseParser(introspectionResults)(
                    type,
                    undefined,
                    undefined
                )(response)
            ).toEqual({
                data: {
                    aliasTitle: 'title1',
                    author: { firstName: 'Toto', id: 'author1' },
                    'author.id': 'author1',
                    coauthor: undefined,
                    'coauthor.id': undefined,
                    embeddedJson: { foo: 'bar' },
                    id: 'post1',
                    tags: [
                        { id: 'tag1', name: 'tag1 name' },
                        { id: 'tag2', name: 'tag2 name' },
                    ],
                    tagsIds: ['tag1', 'tag2'],
                },
            });
        });

        it(`returns the response expected for ${type} with embedded objects`, () => {
            const introspectionResults = {
                resources: [
                    {
                        type: {
                            name: 'User',
                            fields: [
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'firstName',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                    {
                        type: {
                            name: 'Tag',
                            fields: [
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'name',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                ],
                types: [{ name: 'User' }, { name: 'Tag' }],
            };
            const response = {
                data: {
                    data: {
                        _typeName: 'Post',
                        id: 'post1',
                        title: 'title1',
                        author: { id: 'author1', firstName: 'Toto' },
                        coauthor: null,
                        tags: [
                            { id: 'tag1', name: 'tag1 name' },
                            { id: 'tag2', name: 'tag2 name' },
                        ],
                        embeddedJson: {
                            strictEqual: [{ var: 'k5PjloYXQhn' }, true],
                        },
                    },
                },
            };
            expect(
                getResponseParser(introspectionResults)(
                    type,
                    undefined,
                    undefined
                )(response)
            ).toEqual({
                data: {
                    id: 'post1',
                    title: 'title1',
                    'author.id': 'author1',
                    author: { id: 'author1', firstName: 'Toto' },
                    tags: [
                        { id: 'tag1', name: 'tag1 name' },
                        { id: 'tag2', name: 'tag2 name' },
                    ],
                    tagsIds: ['tag1', 'tag2'],
                    embeddedJson: {
                        strictEqual: [{ var: 'k5PjloYXQhn' }, true],
                    },
                },
            });
        });
    });
});
