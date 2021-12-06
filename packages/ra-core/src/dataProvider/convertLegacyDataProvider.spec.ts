import expect from 'expect';

import convertLegacyDataProvider from './convertLegacyDataProvider';

describe('convertLegacyDataProvider', () => {
    it('should return a function allowing old style calls', () => {
        const legacyProvider = jest.fn();
        const convertedProvider = convertLegacyDataProvider(legacyProvider);
        convertedProvider('GET_LIST', 'posts', { filter: { foo: 'bar' } });
        expect(legacyProvider).toHaveBeenCalledWith('GET_LIST', 'posts', {
            filter: { foo: 'bar' },
        });
    });
    it('should return an object allowing new style calls', () => {
        const legacyProvider = jest.fn();
        const convertedProvider = convertLegacyDataProvider(legacyProvider);
        convertedProvider.getList('posts', {
            filter: { foo: 'bar' },
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'id', order: 'ASC' },
        });
        expect(legacyProvider).toHaveBeenCalledWith(
            'GET_LIST',
            'posts',
            expect.objectContaining({
                filter: { foo: 'bar' },
            })
        );
    });
});
