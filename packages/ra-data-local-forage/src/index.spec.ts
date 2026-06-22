import expect from 'expect';
import localforage from 'localforage';

import localForageDataProvider from './index';

jest.mock('localforage', () => ({
    __esModule: true,
    default: {
        keys: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn(),
    },
}));

describe('ra-data-local-forage', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (localforage.keys as jest.Mock).mockResolvedValue([]);
        (localforage.getItem as jest.Mock).mockResolvedValue(undefined);
        (localforage.setItem as jest.Mock).mockResolvedValue(undefined);
    });

    it('creates missing resource collections safely', async () => {
        const dataProvider = localForageDataProvider();

        const response = await dataProvider.create('posts', {
            data: { title: 'Hello world' },
        } as any);

        expect(response.data.title).toEqual('Hello world');
        expect(localforage.setItem).toHaveBeenCalledWith(
            'ra-data-local-forage-posts',
            [expect.objectContaining({ title: 'Hello world' })]
        );
    });

    it.each(['__proto__', 'constructor', 'prototype'])(
        'rejects unsafe resource key %s in update',
        async unsafeKey => {
            const dataProvider = localForageDataProvider();
            await expect(
                dataProvider.update(unsafeKey, {
                    id: 1,
                    data: { title: 'bad' },
                    previousData: { id: 1 },
                } as any)
            ).rejects.toThrow(`Invalid resource key: ${unsafeKey}`);
        }
    );

    it.each(['__proto__', 'constructor', 'prototype'])(
        'rejects unsafe resource key %s in updateMany',
        async unsafeKey => {
            const dataProvider = localForageDataProvider();
            await expect(
                dataProvider.updateMany(unsafeKey, {
                    ids: [1],
                    data: { title: 'bad' },
                } as any)
            ).rejects.toThrow(`Invalid resource key: ${unsafeKey}`);
        }
    );

    it.each(['__proto__', 'constructor', 'prototype'])(
        'rejects unsafe resource key %s in create',
        async unsafeKey => {
            const dataProvider = localForageDataProvider();
            await expect(
                dataProvider.create(unsafeKey, {
                    data: { title: 'bad' },
                } as any)
            ).rejects.toThrow(`Invalid resource key: ${unsafeKey}`);
        }
    );

    it.each(['__proto__', 'constructor', 'prototype'])(
        'rejects unsafe resource key %s in delete',
        async unsafeKey => {
            const dataProvider = localForageDataProvider();
            await expect(
                dataProvider.delete(unsafeKey, {
                    id: 1,
                    previousData: { id: 1 },
                } as any)
            ).rejects.toThrow(`Invalid resource key: ${unsafeKey}`);
        }
    );

    it.each(['__proto__', 'constructor', 'prototype'])(
        'rejects unsafe resource key %s in deleteMany',
        async unsafeKey => {
            const dataProvider = localForageDataProvider();
            await expect(
                dataProvider.deleteMany(unsafeKey, {
                    ids: [1],
                } as any)
            ).rejects.toThrow(`Invalid resource key: ${unsafeKey}`);
        }
    );
});
