import expect from 'expect';

import localStorageDataProvider from './index';

describe('ra-data-local-storage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('creates missing resource collections safely', async () => {
        const dataProvider = localStorageDataProvider({
            localStorageKey: 'ra-data-local-storage-test',
            localStorageUpdateDelay: 0,
        });

        const response = await dataProvider.create('posts', {
            data: { title: 'Hello world' },
        } as any);

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(response.data.title).toEqual('Hello world');
        expect(
            JSON.parse(
                localStorage.getItem('ra-data-local-storage-test') || '{}'
            )
        ).toMatchObject({
            posts: [expect.objectContaining({ title: 'Hello world' })],
        });
    });

    describe('persistence', () => {
        const localStorageKey = 'ra-data-local-storage-test';
        const getDefaultData = () => ({
            posts: [
                { id: 1, title: 'Hello' },
                { id: 2, title: 'World' },
                { id: 3, title: 'Foo' },
            ],
        });
        const getStoredPosts = () =>
            JSON.parse(localStorage.getItem(localStorageKey) || '{}').posts;
        const waitForLocalStorageUpdate = () =>
            new Promise(resolve => setTimeout(resolve, 0));
        const getDataProvider = () =>
            localStorageDataProvider({
                defaultData: getDefaultData(),
                localStorageKey,
                localStorageUpdateDelay: 0,
            });

        it('persists update', async () => {
            const dataProvider = getDataProvider();
            const response = await dataProvider.update('posts', {
                id: 2,
                data: { title: 'Updated' },
                previousData: { id: 2, title: 'World' },
            });
            await waitForLocalStorageUpdate();

            expect(response.data).toEqual({ id: 2, title: 'Updated' });
            expect(getStoredPosts()).toEqual([
                { id: 1, title: 'Hello' },
                { id: 2, title: 'Updated' },
                { id: 3, title: 'Foo' },
            ]);
        });

        it('persists updateMany', async () => {
            const dataProvider = getDataProvider();
            const response = await dataProvider.updateMany('posts', {
                ids: [1, 3],
                data: { title: 'Bar' },
            });
            await waitForLocalStorageUpdate();

            expect(response.data).toEqual([1, 3]);
            expect(getStoredPosts()).toEqual([
                { id: 1, title: 'Bar' },
                { id: 2, title: 'World' },
                { id: 3, title: 'Bar' },
            ]);
        });

        it('persists delete', async () => {
            const dataProvider = getDataProvider();
            const response = await dataProvider.delete('posts', {
                id: 2,
                previousData: { id: 2, title: 'World' },
            });
            await waitForLocalStorageUpdate();

            expect(response.data).toEqual({ id: 2, title: 'World' });
            expect(getStoredPosts()).toEqual([
                { id: 1, title: 'Hello' },
                { id: 3, title: 'Foo' },
            ]);
        });

        it('persists deleteMany', async () => {
            const dataProvider = getDataProvider();
            const response = await dataProvider.deleteMany('posts', {
                ids: [1, 3],
            });
            await waitForLocalStorageUpdate();

            expect(response.data).toEqual([1, 3]);
            expect(getStoredPosts()).toEqual([{ id: 2, title: 'World' }]);
        });
    });

    it('returns an empty list for a missing resource collection', async () => {
        const dataProvider = localStorageDataProvider();

        await expect(
            dataProvider.getList('comments', {
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
            })
        ).resolves.toEqual({ data: [], total: 0 });
        await expect(
            dataProvider.getManyReference('comments', {
                target: 'post_id',
                id: 1,
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
            })
        ).resolves.toEqual({ data: [], total: 0 });
    });

    it.each(['__proto__', 'constructor', 'prototype'])(
        'rejects unsafe resource key %s in update',
        unsafeKey => {
            const dataProvider = localStorageDataProvider();
            expect(() =>
                dataProvider.update(unsafeKey, {
                    id: 1,
                    data: { title: 'bad' },
                    previousData: { id: 1 },
                } as any)
            ).toThrow(`Invalid resource key: ${unsafeKey}`);
        }
    );

    it.each(['__proto__', 'constructor', 'prototype'])(
        'rejects unsafe resource key %s in updateMany',
        unsafeKey => {
            const dataProvider = localStorageDataProvider();
            expect(() =>
                dataProvider.updateMany(unsafeKey, {
                    ids: [1],
                    data: { title: 'bad' },
                } as any)
            ).toThrow(`Invalid resource key: ${unsafeKey}`);
        }
    );

    it.each(['__proto__', 'constructor', 'prototype'])(
        'rejects unsafe resource key %s in create',
        unsafeKey => {
            const dataProvider = localStorageDataProvider();
            expect(() =>
                dataProvider.create(unsafeKey, {
                    data: { title: 'bad' },
                } as any)
            ).toThrow(`Invalid resource key: ${unsafeKey}`);
        }
    );

    it.each(['__proto__', 'constructor', 'prototype'])(
        'rejects unsafe resource key %s in delete',
        unsafeKey => {
            const dataProvider = localStorageDataProvider();
            expect(() =>
                dataProvider.delete(unsafeKey, {
                    id: 1,
                    previousData: { id: 1 },
                } as any)
            ).toThrow(`Invalid resource key: ${unsafeKey}`);
        }
    );

    it.each(['__proto__', 'constructor', 'prototype'])(
        'rejects unsafe resource key %s in deleteMany',
        unsafeKey => {
            const dataProvider = localStorageDataProvider();
            expect(() =>
                dataProvider.deleteMany(unsafeKey, {
                    ids: [1],
                } as any)
            ).toThrow(`Invalid resource key: ${unsafeKey}`);
        }
    );
});
