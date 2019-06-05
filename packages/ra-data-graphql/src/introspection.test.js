import resolveIntrospection, { filterTypesByIncludeExclude } from './introspection';
import { GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE, CREATE, UPDATE, DELETE } from 'ra-core';

describe('introspection', () => {
    describe('filterTypesByIncludeExclude', () => {
        it('return false with an include option containing an array and tested type is not in it', () => {
            expect(
                filterTypesByIncludeExclude({ include: ['Post', 'Comment'] })({
                    name: 'NotMe',
                })
            ).toBe(false);
        });

        it('return true with an include option containing an array and tested type is in it', () => {
            expect(
                filterTypesByIncludeExclude({ include: ['Post', 'Comment'] })({
                    name: 'Post',
                })
            ).toBe(true);
        });

        it('return false with an exclude option containing an array and tested type is in it', () => {
            expect(
                filterTypesByIncludeExclude({ exclude: ['NotMe'] })({
                    name: 'NotMe',
                })
            ).toBe(false);
        });

        it('return true with an include option containing an array and tested type is not in it', () => {
            expect(
                filterTypesByIncludeExclude({ exclude: ['NotMe'] })({
                    name: 'Post',
                })
            ).toBe(true);
        });

        it('return true with an include option being a function returning true', () => {
            const include = jest.fn(() => true);
            const type = { name: 'Post' };
            expect(filterTypesByIncludeExclude({ include })(type)).toBe(true);
            expect(include).toHaveBeenCalledWith(type);
        });

        it('return false with an include option being a function returning false', () => {
            const include = jest.fn(() => false);
            const type = { name: 'Post' };
            expect(filterTypesByIncludeExclude({ include })(type)).toBe(false);
            expect(include).toHaveBeenCalledWith(type);
        });

        it('return false with an exclude option being a function returning true', () => {
            const exclude = jest.fn(() => true);
            const type = { name: 'Post' };
            expect(filterTypesByIncludeExclude({ exclude })(type)).toBe(false);
            expect(exclude).toHaveBeenCalledWith(type);
        });

        it('return true with an exclude option being a function returning false', () => {
            const exclude = jest.fn(() => false);
            const type = { name: 'Post' };
            expect(filterTypesByIncludeExclude({ exclude })(type)).toBe(true);
            expect(exclude).toHaveBeenCalledWith(type);
        });
    });

    describe('introspection parsing returns an object', () => {
        const client = {
            query: jest.fn(() =>
                Promise.resolve({
                    data: {
                        __schema: {
                            queryType: { name: 'Query' },
                            mutationType: { name: 'Mutation' },
                            types: [
                                {
                                    name: 'Query',
                                    fields: [
                                        { name: 'allPost' },
                                        { name: 'Post' },
                                        { name: 'allComment' },
                                        { name: 'Comment' },
                                    ],
                                },
                                {
                                    name: 'Mutation',
                                    fields: [
                                        { name: 'createPost' },
                                        { name: 'updatePost' },
                                        { name: 'deletePost' },
                                        { name: 'createIHavePartialCrud' },
                                        { name: 'updateIHavePartialCrud' },
                                        { name: 'deleteIHavePartialCrud' },
                                    ],
                                },
                                { name: 'Post' },
                                { name: 'Comment' },
                                { name: 'IHavePartialCrud' },
                                { name: 'ImExcluded' },
                            ],
                        },
                    },
                })
            ),
        };

        const introspectionResultsPromise = resolveIntrospection(client, {
            operationNames: {
                [GET_LIST]: resource => `all${resource.name}`,
                [GET_ONE]: resource => `${resource.name}`,
                [GET_MANY]: resource => `all${resource.name}`,
                [GET_MANY_REFERENCE]: resource => `all${resource.name}`,
                [CREATE]: resource => `create${resource.name}`,
                [UPDATE]: resource => `update${resource.name}`,
                [DELETE]: resource => `delete${resource.name}`,
            },
            exclude: ['ImExcluded'],
        });

        it('with a "types" array containing all types found', async () => {
            const introspectionResults = await introspectionResultsPromise;
            expect(introspectionResults.types).toHaveLength(4);
        });

        it('with a "queries" array containing all queries and mutations found', async () => {
            const introspectionResults = await introspectionResultsPromise;
            expect(introspectionResults.queries).toEqual([
                { name: 'allPost' },
                { name: 'Post' },
                { name: 'allComment' },
                { name: 'Comment' },
                { name: 'createPost' },
                { name: 'updatePost' },
                { name: 'deletePost' },
                { name: 'createIHavePartialCrud' },
                { name: 'updateIHavePartialCrud' },
                { name: 'deleteIHavePartialCrud' },
            ]);
        });

        it('with a "resources" array containing objects describing resources', async () => {
            const introspectionResults = await introspectionResultsPromise;
            expect(introspectionResults.resources).toEqual([
                {
                    type: { name: 'Post' },
                    [GET_LIST]: { name: 'allPost' },
                    [GET_ONE]: { name: 'Post' },
                    [GET_MANY]: { name: 'allPost' },
                    [GET_MANY_REFERENCE]: { name: 'allPost' },
                    [CREATE]: { name: 'createPost' },
                    [UPDATE]: { name: 'updatePost' },
                    [DELETE]: { name: 'deletePost' },
                },
                {
                    type: { name: 'Comment' },
                    [GET_LIST]: { name: 'allComment' },
                    [GET_ONE]: { name: 'Comment' },
                    [GET_MANY]: { name: 'allComment' },
                    [GET_MANY_REFERENCE]: { name: 'allComment' },
                },
            ]);
        });
    });
});
