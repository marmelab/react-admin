import expect from 'expect';
import { testDataProvider } from './testDataProvider';

import { withLifecycleCallbacks } from './withLifecycleCallbacks';

describe('withLifecycleCallbacks', () => {
    it('should be called when the resource matches', async () => {
        const resourceCallback = {
            resource: 'posts',
            beforeGetOne: jest.fn(params => Promise.resolve(params)),
        };
        const dataProvider = withLifecycleCallbacks(testDataProvider(), [
            resourceCallback,
        ]);
        dataProvider.getOne('posts', { id: 1 });
        expect(resourceCallback.beforeGetOne).toHaveBeenCalled();
    });
    it('should not be called when the resource does not match', async () => {
        const resourceCallback = {
            resource: 'posts',
            beforeGetOne: jest.fn(params => Promise.resolve(params)),
        };
        const dataProvider = withLifecycleCallbacks(testDataProvider(), [
            resourceCallback,
        ]);
        dataProvider.getOne('comments', { id: 1 });
        expect(resourceCallback.beforeGetOne).not.toHaveBeenCalled();
    });
    it('should allow more than one callback per resource', async () => {
        const resourceCallback = {
            resource: 'posts',
            beforeGetOne: jest.fn(params => Promise.resolve(params)),
            beforeGetMany: jest.fn(params => Promise.resolve(params)),
        };
        const dataProvider = withLifecycleCallbacks(testDataProvider(), [
            resourceCallback,
        ]);

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
                getList: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeGetList: jest.fn(params =>
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
                getList: jest.fn(() =>
                    Promise.resolve({
                        data: [{ id: 1, title: 'foo' }],
                        total: 1,
                    })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterGetList: jest.fn(() =>
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
                getOne: jest.fn(() => Promise.resolve({ data: {} })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeGetOne: jest.fn(params =>
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
                getOne: jest.fn(() =>
                    Promise.resolve({ data: { id: 1, title: 'foo' } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterGetOne: jest.fn(result =>
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
                getMany: jest.fn(() => Promise.resolve({ data: [] })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeGetMany: jest.fn(params =>
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
                getMany: jest.fn(() =>
                    Promise.resolve({
                        data: [{ id: 1, title: 'foo' }],
                    })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterGetMany: jest.fn(result =>
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
                getManyReference: jest.fn(() =>
                    Promise.resolve({ data: [], total: 0 })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeGetManyReference: jest.fn(params =>
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
                getManyReference: jest.fn(() =>
                    Promise.resolve({
                        data: [{ id: 1, title: 'foo' }],
                        total: 1,
                    })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterGetManyReference: jest.fn(result =>
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
                getOne: jest.fn(() =>
                    Promise.resolve({ data: { id: 1, title: 'foo' } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterRead: jest.fn(record =>
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
                getList: jest.fn(() =>
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
                    afterRead: jest.fn(record =>
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
                getMany: jest.fn(() =>
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
                    afterRead: jest.fn(record =>
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
                getManyReference: jest.fn(() =>
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
                    afterRead: jest.fn(record =>
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
                create: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeCreate: jest.fn(params =>
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
                create: jest.fn((resource, { data }) =>
                    Promise.resolve({ data: { id: 1, ...data } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterCreate: jest.fn(result =>
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
                update: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeUpdate: jest.fn(params =>
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
                update: jest.fn((resource, { id, data }) =>
                    Promise.resolve({ data: { id, ...data } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterUpdate: jest.fn(result =>
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
                updateMany: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeUpdateMany: jest.fn(params =>
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
                updateMany: jest.fn((resource, { ids }) =>
                    Promise.resolve({ data: ids })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterUpdateMany: jest.fn(result =>
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
                create: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeSave: jest.fn(data =>
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
                update: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeSave: jest.fn(data =>
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
                updateMany: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeSave: jest.fn(data =>
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
                create: jest.fn((resource, { data }) =>
                    Promise.resolve({ data: { id: 1, ...data } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterSave: jest.fn(record =>
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
                update: jest.fn((resource, { id, data }) =>
                    Promise.resolve({ data: { id, ...data } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterSave: jest.fn(record =>
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
                getMany: jest.fn((resource, { ids }) =>
                    Promise.resolve({
                        data: ids.map(id => ({ id })),
                    })
                ),
                updateMany: jest.fn((resource, { ids }) =>
                    Promise.resolve({ data: ids })
                ),
            };
            const resourceCallback = {
                resource: 'posts',
                afterSave: jest.fn(record =>
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
                delete: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeDelete: jest.fn(params =>
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
                delete: jest.fn((resource, { id }) =>
                    Promise.resolve({ data: { id } })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterDelete: jest.fn(result =>
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
                deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] })),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    beforeDeleteMany: jest.fn(params =>
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
                deleteMany: jest.fn((resource, { ids }) =>
                    Promise.resolve({ data: ids })
                ),
            };
            const dataProvider = withLifecycleCallbacks(base, [
                {
                    resource: 'posts',
                    afterDeleteMany: jest.fn(result =>
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
});
