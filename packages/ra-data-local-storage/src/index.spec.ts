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
