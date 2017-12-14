import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
} from 'react-admin';
import buildVariables from './buildVariables';

describe('buildVariables', () => {
    describe('GET_LIST', () => {
        it('returns correct variables', () => {
            const introspectionResult = {
                types: [
                    {
                        name: 'PostFilter',
                        inputFields: [{ name: 'tags_some' }],
                    },
                ],
            };
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
                    { type: { name: 'Post' } },
                    GET_LIST,
                    params,
                    {}
                )
            ).toEqual({
                filter: {
                    id_in: ['foo1', 'foo2'],
                    tags_some: { id_in: ['tag1', 'tag2'] },
                    author: { id: 'author1' },
                    views: 100,
                },
                first: 10,
                orderBy: 'sortField_DESC',
                skip: 90,
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
                buildVariables()(
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
    });

    describe('UPDATE', () => {
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
                buildVariables()(
                    { type: { name: 'Post' } },
                    UPDATE,
                    params,
                    queryType
                )
            ).toEqual({
                authorId: 'author1',
                tagsIds: ['tag1', 'tag2'],
                title: 'Foo',
            });
        });
    });

    describe('GET_MANY', () => {
        it('returns correct variables', () => {
            const params = {
                ids: ['tag1', 'tag2'],
            };

            expect(
                buildVariables()(
                    { type: { name: 'Post' } },
                    GET_MANY,
                    params,
                    {}
                )
            ).toEqual({
                filter: { id_in: ['tag1', 'tag2'] },
            });
        });
    });

    describe('GET_MANY_REFERENCE', () => {
        it('returns correct variables', () => {
            const params = {
                target: 'author.id',
                id: 'author1',
            };

            expect(
                buildVariables()(
                    { type: { name: 'Post' } },
                    GET_MANY_REFERENCE,
                    params,
                    {}
                )
            ).toEqual({
                filter: { author: { id: 'author1' } },
            });
        });
    });

    describe('DELETE', () => {
        it('returns correct variables', () => {
            const params = {
                id: 'post1',
            };

            expect(
                buildVariables()(
                    { type: { name: 'Post', inputFields: [] } },
                    DELETE,
                    params,
                    {}
                )
            ).toEqual({
                id: 'post1',
            });
        });
    });
});
