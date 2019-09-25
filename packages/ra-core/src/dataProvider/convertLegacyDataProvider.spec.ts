import expect from 'expect';

import convertLegacyDataProvider from './convertLegacyDataProvider';

describe('convertLegacyDataProvider', () => {
    it('should return a function allowing old style calls', () => {
        const legacyProvider = jest.fn();
        const convertedProvider = convertLegacyDataProvider(legacyProvider);
        convertedProvider('GET_LIST', 'posts', { foo: 'bar' });
        expect(legacyProvider).toHaveBeenCalledWith('GET_LIST', 'posts', {
            foo: 'bar',
        });
    });
    it('should return an object allowing new style calls', () => {
        const legacyProvider = jest.fn();
        const convertedProvider = convertLegacyDataProvider(legacyProvider);
        convertedProvider.getList('posts', { foo: 'bar' });
        expect(legacyProvider).toHaveBeenCalledWith('GET_LIST', 'posts', {
            foo: 'bar',
        });
    });
});
