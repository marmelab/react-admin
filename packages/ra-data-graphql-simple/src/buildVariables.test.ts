import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    DELETE_MANY,
    UPDATE_MANY,
} from 'ra-core';
import buildVariables from './buildVariables';

describe('buildVariables', () => {
    const introspectionResult = {
        types: [
            {
                name: 'PostFilter',
                inputFields: [{ name: 'tags_some' }],
            },
        ],
    };
    describe('GET_LIST', () => {
        it('returns correct variables', () => {
            const params = {
                filter: {
                    ids: ['foo1', 'foo2'],
                    tags: { id: ['tag1', 'tag2'] },
                    'author.id': 'author1',
                    views: 100,
                },
                pagination: { page: 10, perPage: 10 },
                sort: { field: 'sortField', order: 'DESC' },
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post', fields: [] } },
                    GET_LIST,
                    params,
                    {}
                )
            ).toEqual({
                filter: {
                    ids: ['foo1', 'foo2'],
                    tags_some: { id_in: ['tag1', 'tag2'] },
                    author: { id: 'author1' },
                    views: 100,
                },
                page: 9,
                perPage: 10,
                sortField: 'sortField',
                sortOrder: 'DESC',
            });
        });

        it('should return correct meta', () => {
            const params = {
                filter: {},
                meta: { sparseFields: [] },
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post', fields: [] } },
                    GET_LIST,
                    params,
                    {}
                )
            ).toEqual({
                filter: {},
                meta: { sparseFields: [] },
            });
        });
    });

    describe('CREATE', () => {
        it('returns correct variables', () => {
            const params = {
                data: {
                    author: { id: 'author1' },
                    tags: [{ id: 'tag1' }, { id: 'tag2' }],
                    title: 'Foo',
                },
            };
            const queryType = {
                args: [{ name: 'tagsIds' }, { name: 'authorId' }],
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    CREATE,
                    params,
                    queryType
                )
            ).toEqual({
                authorId: 'author1',
                tagsIds: ['tag1', 'tag2'],
                title: 'Foo',
            });
        });
        it('should return correct meta', () => {
            const params = {
                data: {
                    meta: { sparseFields: [] },
                },
            };
            const queryType = {
                args: [],
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    CREATE,
                    params,
                    queryType
                )
            ).toEqual({
                meta: { sparseFields: [] },
            });
        });
    });

    describe('UPDATE', () => {
        it('returns correct variables', () => {
            const params = {
                id: 'post1',
                data: {
                    author: { id: 'author1' },
                    tags: [{ id: 'tag1' }, { id: 'tag2' }],
                    title: 'Foo',
                },
            };
            const queryType = {
                args: [{ name: 'tagsIds' }, { name: 'authorId' }],
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    UPDATE,
                    params,
                    queryType
                )
            ).toEqual({
                id: 'post1',
                authorId: 'author1',
                tagsIds: ['tag1', 'tag2'],
                title: 'Foo',
            });
        });

        it('should return correct meta', () => {
            const params = {
                data: {
                    meta: { sparseFields: [] },
                },
            };
            const queryType = {
                args: [],
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    UPDATE,
                    params,
                    queryType
                )
            ).toEqual({
                meta: { sparseFields: [] },
            });
        });
    });

    describe('GET_MANY', () => {
        it('returns correct variables', () => {
            const params = {
                ids: ['tag1', 'tag2'],
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    GET_MANY,
                    params,
                    {}
                )
            ).toEqual({
                filter: { ids: ['tag1', 'tag2'] },
            });
        });

        it('should return correct meta', () => {
            const params = {
                meta: { sparseFields: [] },
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    GET_MANY,
                    params,
                    {}
                )
            ).toEqual({
                filter: {},
                meta: { sparseFields: [] },
            });
        });
    });

    describe('GET_MANY_REFERENCE', () => {
        it('returns correct variables', () => {
            const params = {
                target: 'author_id',
                id: 'author1',
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'name', order: 'ASC' },
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    GET_MANY_REFERENCE,
                    params,
                    {}
                )
            ).toEqual({
                filter: { author_id: 'author1' },
                page: 0,
                perPage: 10,
                sortField: 'name',
                sortOrder: 'ASC',
            });
        });

        it('should return correct meta', () => {
            const params = {
                meta: { sparseFields: [] },
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    GET_MANY_REFERENCE,
                    params,
                    {}
                )
            ).toEqual({
                filter: {},
                meta: { sparseFields: [] },
            });
        });
    });

    describe('DELETE', () => {
        it('returns correct variables', () => {
            const params = {
                id: 'post1',
            };
            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post', inputFields: [] } },
                    DELETE,
                    params,
                    {}
                )
            ).toEqual({
                id: 'post1',
            });
        });

        it('should return correct meta', () => {
            const params = {
                meta: { sparseFields: [] },
            };
            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post', inputFields: [] } },
                    DELETE,
                    params,
                    {}
                )
            ).toEqual({
                meta: { sparseFields: [] },
            });
        });
    });

    describe('DELETE_MANY', () => {
        it('returns correct variables', () => {
            const params = {
                ids: ['post1'],
            };
            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post', inputFields: [] } },
                    DELETE_MANY,
                    params,
                    {}
                )
            ).toEqual({
                ids: ['post1'],
            });
        });
    });

    describe('UPDATE_MANY', () => {
        it('returns correct variables', () => {
            const params = {
                ids: ['post1', 'post2'],
                data: {
                    title: 'New Title',
                },
            };
            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post', inputFields: [] } },
                    UPDATE_MANY,
                    params,
                    {}
                )
            ).toEqual({
                ids: ['post1', 'post2'],
                data: {
                    title: 'New Title',
                },
            });
        });
    });
});
