import { expect } from 'vitest';
import { testDataProvider } from './testDataProvider';

import { withLifecycleCallbacks } from './withLifecycleCallbacks';

describe('withLifecycleCallbacks', () => {
    it('should be called when the resource matches', async () => {
        const resourceCallback = {
            resource: 'posts',
            beforeGetOne: vi.fn(params => Promise.resolve(params)),
        };
        const dataProvider = withLifecycleCallbacks(
            testDataProvider({
                getOne: async () => ({ data: { id: 123 } }),
            }),
            [resourceCallback]
        );
        dataProvider.getOne('posts', { id: 1 });
        expect(resourceCallback.beforeGetOne).toHaveBeenCalled();
    });
    it('should not be called when the resource does not match', async () => {
        const resourceCallback = {
            resource: 'posts',
            beforeGetOne: vi.fn(params => Promise.resolve(params)),
        };
        const dataProvider = withLifecycleCallbacks(
            testDataProvider({
                getOne: async () => ({ data: { id: 123 } }),
            }),
            [resourceCallback]
        );
        dataProvider.getOne('comments', { id: 1 });
        expect(resourceCallback.beforeGetOne).not.toHaveBeenCalled();
    });
    it('should allow more than one callback per resource', async () => {
        const resourceCallback = {
            resource: 'posts',
            beforeGetOne: vi.fn(params => Promise.resolve(params)),
            beforeGetMany: vi.fn(params => Promise.resolve(params)),
        };
        const dataProvider = withLifecycleCallbacks(
            testDataProvider({
                getOne: async () => ({ data: { id: 123 } }),
                getMany: async () => ({ data: [{ id: 123 }, { id: 456 }] }),
            }),
            [resourceCallback]
        );

        dataProvider.getOne('posts', { id: 1 });
        expect(resourceCallback.beforeGetOne).toHaveBeenCalled();

        dataProvider.getMany('posts', { ids: [1, 2] });
        expect(resourceCallback.beforeGetMany).toHaveBeenCalled();
    });

    describe('beforeGetList', () => {
        it('should update the getList parameters', async () => {
            const params = {
                filter: { q: 'foo' },
                sort: { field: 'id', order: 'DESC' },
                pagination: { page: 1, perPage: 10 },
            };
            const base = {
                getList: vi.fn(() => Promise.resolve({ data: [], total: 0 })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeGetList: vi.fn(params =>
                        Promise.resolve({ ...params, meta: 'foo' })
                    ),
                },
            ]);

            await dataProvider.getList('posts', params);

            expect(base.getList).toHaveBeenCalledWith('posts', {
                ...params,
                meta: 'foo',
            });
        });
    });

    describe('afterGetList', () => {
        it('should update the getList result', async () => {
            const base = {
                getList: vi.fn(() =>
                    Promise.resolve({
                        data: [{ id: 1, title: 'foo' }],
                        total: 1,
                    })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterGetList: vi.fn(() =>
                        Promise.resolve({
                            data: [{ id: 1, title: 'bar' }],
                            total: 1,
                        })
                    ),
                },
            ]);

            const result = await dataProvider.getList('posts', {});

            expect(result).toEqual({
                data: [{ id: 1, title: 'bar' }],
                total: 1,
            });
        });
    });

    describe('beforeGetOne', () => {
        it('should update the getOne parameters', async () => {
            const params = { id: 1 };
            const base = {
                getOne: vi.fn(() => Promise.resolve({ data: {} })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeGetOne: vi.fn(params =>
                        Promise.resolve({ ...params, meta: 'foo' })
                    ),
                },
            ]);

            await dataProvider.getOne('posts', params);

            expect(base.getOne).toHaveBeenCalledWith('posts', {
                ...params,
                meta: 'foo',
            });
        });
    });
    describe('afterGetOne', () => {
        it('should update the getOne result', async () => {
            const base = {
                getOne: vi.fn(() =>
                    Promise.resolve({ data: { id: 1, title: 'foo' } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterGetOne: vi.fn(result =>
                        Promise.resolve({
                            data: { ...result.data, title: 'bar' },
                        })
                    ),
                },
            ]);

            const result = await dataProvider.getOne('posts', { id: 1 });

            expect(result).toEqual({
                data: { id: 1, title: 'bar' },
            });
        });
    });

    describe('beforeGetMany', () => {
        it('should update the getMany parameters', async () => {
            const params = { ids: [1, 2] };
            const base = {
                getMany: vi.fn(() => Promise.resolve({ data: [] })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeGetMany: vi.fn(params =>
                        Promise.resolve({ ...params, meta: 'foo' })
                    ),
                },
            ]);

            await dataProvider.getMany('posts', params);

            expect(base.getMany).toHaveBeenCalledWith('posts', {
                ...params,
                meta: 'foo',
            });
        });
    });

    describe('afterGetMany', () => {
        it('should update the getMany result', async () => {
            const base = {
                getMany: vi.fn(() =>
                    Promise.resolve({
                        data: [{ id: 1, title: 'foo' }],
                    })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterGetMany: vi.fn(result =>
                        Promise.resolve({
                            data: [{ ...result.data[0], title: 'bar' }],
                        })
                    ),
                },
            ]);

            const result = await dataProvider.getMany('posts', { ids: [1] });

            expect(result).toEqual({
                data: [{ id: 1, title: 'bar' }],
            });
        });
    });

    describe('beforeGetManyReference', () => {
        it('should update the getManyReference parameters', async () => {
            const params = {
                target: '1',
                id: '1',
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
            };
            const base = {
                getManyReference: vi.fn(() =>
                    Promise.resolve({ data: [], total: 0 })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeGetManyReference: vi.fn(params =>
                        Promise.resolve({ ...params, meta: 'foo' })
                    ),
                },
            ]);

            await dataProvider.getManyReference('posts', params);

            expect(base.getManyReference).toHaveBeenCalledWith('posts', {
                ...params,
                meta: 'foo',
            });
        });
    });

    describe('afterGetManyReference', () => {
        it('should update the getManyReference result', async () => {
            const base = {
                getManyReference: vi.fn(() =>
                    Promise.resolve({
                        data: [{ id: 1, title: 'foo' }],
                        total: 1,
                    })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterGetManyReference: vi.fn(result =>
                        Promise.resolve({
                            data: [{ ...result.data[0], title: 'bar' }],
                            total: 1,
                        })
                    ),
                },
            ]);

            const result = await dataProvider.getManyReference('posts', {
                target: '1',
                id: '1',
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
            });

            expect(result).toEqual({
                data: [{ id: 1, title: 'bar' }],
                total: 1,
            });
        });
    });

    describe('afterRead', () => {
        it('should update the getOne result', async () => {
            const base = {
                getOne: vi.fn(() =>
                    Promise.resolve({ data: { id: 1, title: 'foo' } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterRead: vi.fn(record =>
                        Promise.resolve({
                            ...record,
                            title: 'bar',
                        })
                    ),
                },
            ]);

            const result = await dataProvider.getOne('posts', { id: 1 });

            expect(result).toEqual({
                data: { id: 1, title: 'bar' },
            });
        });

        it('should update the getList result', async () => {
            const base = {
                getList: vi.fn(() =>
                    Promise.resolve({
                        data: [
                            { id: 1, title: 'foo' },
                            { id: 2, title: 'foo' },
                        ],
                        total: 2,
                    })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterRead: vi.fn(record =>
                        Promise.resolve({
                            ...record,
                            title: 'bar',
                        })
                    ),
                },
            ]);

            const result = await dataProvider.getList('posts', {
                filter: { q: 'foo' },
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'ASC' },
            });

            expect(result).toEqual({
                data: [
                    { id: 1, title: 'bar' },
                    { id: 2, title: 'bar' },
                ],
                total: 2,
            });
        });

        it('should update the getMany result', async () => {
            const base = {
                getMany: vi.fn(() =>
                    Promise.resolve({
                        data: [
                            { id: 1, title: 'foo' },
                            { id: 2, title: 'foo' },
                        ],
                    })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterRead: vi.fn(record =>
                        Promise.resolve({
                            ...record,
                            title: 'bar',
                        })
                    ),
                },
            ]);

            const result = await dataProvider.getMany('posts', { ids: [1, 2] });

            expect(result).toEqual({
                data: [
                    { id: 1, title: 'bar' },
                    { id: 2, title: 'bar' },
                ],
            });
        });

        it('should update the getManyReference result', async () => {
            const base = {
                getManyReference: vi.fn(() =>
                    Promise.resolve({
                        data: [
                            { id: 1, title: 'foo' },
                            { id: 2, title: 'foo' },
                        ],
                        total: 2,
                    })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterRead: vi.fn(record =>
                        Promise.resolve({
                            ...record,
                            title: 'bar',
                        })
                    ),
                },
            ]);

            const result = await dataProvider.getManyReference('posts', {
                target: 'author_id',
                id: 1,
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
            });

            expect(result).toEqual({
                data: [
                    { id: 1, title: 'bar' },
                    { id: 2, title: 'bar' },
                ],
                total: 2,
            });
        });
    });

    describe('beforeCreate', () => {
        it('should update the create parameters', async () => {
            const params = {
                data: { title: 'foo' },
            };
            const base = {
                create: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeCreate: vi.fn(params =>
                        Promise.resolve({ ...params, meta: 'foo' })
                    ),
                },
            ]);

            await dataProvider.create('posts', params);

            expect(base.create).toHaveBeenCalledWith('posts', {
                ...params,
                meta: 'foo',
            });
        });
    });

    describe('afterCreate', () => {
        it('should update the create result', async () => {
            const base = {
                create: vi.fn((resource, { data }) =>
                    Promise.resolve({ data: { id: 1, ...data } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterCreate: vi.fn(result =>
                        Promise.resolve({
                            data: { ...result.data, foo: 'bar' },
                        })
                    ),
                },
            ]);

            const result = await dataProvider.create('posts', {
                data: { title: 'foo' },
            });

            expect(result).toEqual({
                data: { id: 1, title: 'foo', foo: 'bar' },
            });
        });
    });

    describe('beforeUpdate', () => {
        it('should update the update parameters', async () => {
            const params = {
                id: 1,
                data: { title: 'foo' },
                previousData: { title: 'bar' },
            };
            const base = {
                update: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeUpdate: vi.fn(params =>
                        Promise.resolve({ ...params, meta: 'foo' })
                    ),
                },
            ]);

            await dataProvider.update('posts', params);

            expect(base.update).toHaveBeenCalledWith('posts', {
                ...params,
                meta: 'foo',
            });
        });
    });

    describe('afterUpdate', () => {
        it('should update the update result', async () => {
            const base = {
                update: vi.fn((resource, { id, data }) =>
                    Promise.resolve({ data: { id, ...data } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterUpdate: vi.fn(result =>
                        Promise.resolve({
                            data: { ...result.data, foo: 'bar' },
                        })
                    ),
                },
            ]);

            const result = await dataProvider.update('posts', {
                id: 1,
                data: { title: 'foo' },
                previousData: { title: 'bar' },
            });

            expect(result).toEqual({
                data: { id: 1, title: 'foo', foo: 'bar' },
            });
        });
    });

    describe('beforeUpdateMany', () => {
        it('should update the updateMany parameters', async () => {
            const params = {
                ids: [1, 2],
                data: { title: 'foo' },
            };
            const base = {
                updateMany: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeUpdateMany: vi.fn(params =>
                        Promise.resolve({ ...params, meta: 'foo' })
                    ),
                },
            ]);

            await dataProvider.updateMany('posts', params);

            expect(base.updateMany).toHaveBeenCalledWith('posts', {
                ...params,
                meta: 'foo',
            });
        });
    });

    describe('afterUpdateMany', () => {
        it('should update the updateMany result', async () => {
            const base = {
                updateMany: vi.fn((resource, { ids }) =>
                    Promise.resolve({ data: ids })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterUpdateMany: vi.fn(result =>
                        Promise.resolve({
                            data: [...result.data, 'foo', 'bar'],
                        })
                    ),
                },
            ]);

            const result = await dataProvider.updateMany('posts', {
                ids: [1, 2],
                data: { title: 'foo' },
            });

            expect(result).toEqual({
                data: [1, 2, 'foo', 'bar'],
            });
        });
    });

    describe('beforeSave', () => {
        it('should update the create data parameter', async () => {
            const params = {
                data: { title: 'foo' },
            };
            const base = {
                create: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeSave: vi.fn(data =>
                        Promise.resolve({ ...data, foo: 'bar' })
                    ),
                },
            ]);

            await dataProvider.create('posts', params);

            expect(base.create).toHaveBeenCalledWith('posts', {
                data: { ...params.data, foo: 'bar' },
            });
        });
        it('should update the update data parameter', async () => {
            const params = {
                id: 1,
                data: { title: 'foo' },
                previousData: { title: 'bar' },
            };
            const base = {
                update: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeSave: vi.fn(data =>
                        Promise.resolve({ ...data, foo: 'bar' })
                    ),
                },
            ]);

            await dataProvider.update('posts', params);

            expect(base.update).toHaveBeenCalledWith('posts', {
                id: 1,
                data: { ...params.data, foo: 'bar' },
                previousData: params.previousData,
            });
        });
        it('should update the updateMany data parameter', async () => {
            const params = {
                ids: [1, 2],
                data: { title: 'foo' },
            };
            const base = {
                updateMany: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeSave: vi.fn(data =>
                        Promise.resolve({ ...data, foo: 'bar' })
                    ),
                },
            ]);

            await dataProvider.updateMany('posts', params);

            expect(base.updateMany).toHaveBeenCalledWith('posts', {
                ids: params.ids,
                data: { title: 'foo', foo: 'bar' },
            });
        });
    });
    describe('afterSave', () => {
        it('should alter the create result data', async () => {
            const base = {
                create: vi.fn((resource, { data }) =>
                    Promise.resolve({ data: { id: 1, ...data } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterSave: vi.fn(record =>
                        Promise.resolve({
                            ...record,
                            foo: 'bar',
                        })
                    ),
                },
            ]);

            const result = await dataProvider.create('posts', {
                data: { title: 'foo' },
            });

            expect(result).toEqual({
                data: { id: 1, title: 'foo', foo: 'bar' },
            });
        });
        it('should alter the update result data', async () => {
            const base = {
                update: vi.fn((resource, { id, data }) =>
                    Promise.resolve({ data: { id, ...data } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterSave: vi.fn(record =>
                        Promise.resolve({
                            ...record,
                            foo: 'bar',
                        })
                    ),
                },
            ]);

            const result = await dataProvider.update('posts', {
                id: 1,
                data: { title: 'foo' },
                previousData: { title: 'bar' },
            });

            expect(result).toEqual({
                data: { id: 1, title: 'foo', foo: 'bar' },
            });
        });
        it('should be called on the updateMany', async () => {
            const base = {
                getMany: vi.fn((resource, { ids }) =>
                    Promise.resolve({
                        data: ids.map(id => ({ id })),
                    })
                ),
                updateMany: vi.fn((resource, { ids }) =>
                    Promise.resolve({ data: ids })
                ),
            };
            const resourceCallback = {
                resource: 'posts',
                afterSave: vi.fn(record =>
                    Promise.resolve({
                        ...record,
                        foo: 'bar',
                    })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                resourceCallback,
            ]);

            const result = await dataProvider.updateMany('posts', {
                ids: [1, 2],
                data: { title: 'foo' },
            });

            expect(result).toEqual({
                data: [1, 2],
            });
            expect(resourceCallback.afterSave).toHaveBeenCalledTimes(2);
        });
    });

    describe('beforeDelete', () => {
        it('should update the delete params', async () => {
            const params = {
                id: 1,
            };
            const base = {
                delete: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeDelete: vi.fn(params =>
                        Promise.resolve({ ...params, foo: 'bar' })
                    ),
                },
            ]);

            await dataProvider.delete('posts', params);

            expect(base.delete).toHaveBeenCalledWith('posts', {
                id: 1,
                foo: 'bar',
            });
        });
    });
    describe('afterDelete', () => {
        it('should alter the delete result', async () => {
            const base = {
                delete: vi.fn((resource, { id }) =>
                    Promise.resolve({ data: { id } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterDelete: vi.fn(result =>
                        Promise.resolve({
                            data: { ...result.data, foo: 'bar' },
                        })
                    ),
                },
            ]);

            const result = await dataProvider.delete('posts', {
                id: 1,
            });

            expect(result).toEqual({
                data: { id: 1, foo: 'bar' },
            });
        });
    });

    describe('beforeDeleteMany', () => {
        it('should update the deleteMany params', async () => {
            const params = {
                ids: [1, 2],
            };
            const base = {
                deleteMany: vi.fn(() => Promise.resolve({ data: [1, 2] })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeDeleteMany: vi.fn(params =>
                        Promise.resolve({ ...params, meta: 'bar' })
                    ),
                },
            ]);

            await dataProvider.deleteMany('posts', params);

            expect(base.deleteMany).toHaveBeenCalledWith('posts', {
                ids: [1, 2],
                meta: 'bar',
            });
        });
    });

    describe('afterDeleteMany', () => {
        it('should alter the deleteMany result', async () => {
            const base = {
                deleteMany: vi.fn((resource, { ids }) =>
                    Promise.resolve({ data: ids })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterDeleteMany: vi.fn(result =>
                        Promise.resolve({
                            data: [...result.data, 'foo', 'bar'],
                        })
                    ),
                },
            ]);

            const result = await dataProvider.deleteMany('posts', {
                ids: [1, 2],
            });

            expect(result).toEqual({
                data: [1, 2, 'foo', 'bar'],
            });
        });
    });

    describe('wildcard', () => {
        it('a wildcard should apply to all resources', async () => {
            const params = {
                filter: { q: 'foo' },
                sort: { field: 'id', order: 'DESC' },
                pagination: { page: 1, perPage: 10 },
            };
            const base = {
                getList: vi.fn(() => Promise.resolve({ data: [], total: 0 })),
            };

            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: '*',
                    beforeGetList: vi.fn(params =>
                        Promise.resolve({ ...params, meta: 'foo' })
                    ),
                },
            ]);

            await dataProvider.getList('posts', params);

            expect(base.getList).toHaveBeenCalledWith('posts', {
                ...params,
                meta: 'foo',
            });
        });
    });

    describe('multiple callbacks', () => {
        it('you can pass multiple callbacks as an array', async () => {
            const params = {
                filter: { q: 'foo' },
                sort: { field: 'id', order: 'DESC' },
                pagination: { page: 1, perPage: 10 },
            };
            const base = {
                getList: vi.fn(() => Promise.resolve({ data: [], total: 0 })),
            };

            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeGetList: [
                        vi.fn(params =>
                            Promise.resolve({ ...params, one: 'done' })
                        ),
                        vi.fn(params =>
                            Promise.resolve({ ...params, two: 'done' })
                        ),
                        vi.fn(params =>
                            Promise.resolve({ ...params, three: 'done' })
                        ),
                    ],
                },
            ]);

            await dataProvider.getList('posts', params);

            expect(base.getList).toHaveBeenCalledWith('posts', {
                ...params,
                one: 'done',
                two: 'done',
                three: 'done',
            });
        });
    });
});
