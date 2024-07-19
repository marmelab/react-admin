import { DataProvider } from '../types';

/**
 * A dataProvider meant to be used in tests only. You can override any of its methods by passing a partial dataProvider.
 *
 * @example
 * const dataProvider = testDataProvider({
 *    getOne: async () => ({ data: { id: 123, title: 'foo' }})
 * })
 */

const defaultTestDataProvider: DataProvider = {
    create: async () => {
        throw new Error('create is not implemented');
    },
    delete: async () => {
        throw new Error('delete not implemented');
    },
    deleteMany: async () => {
        throw new Error('deleteMany is not implemented');
    },
    getList: async () => {
        throw new Error('getList is not implemented');
    },
    getMany: async () => {
        throw new Error('getMany is not implemented');
    },
    getManyReference: async () => {
        throw new Error('getManyReference is not implemented');
    },
    getOne: async () => {
        throw new Error('getOne is not implemented');
    },
    update: async () => {
        throw new Error('update not implemented');
    },
    updateMany: async () => {
        throw new Error('updateMany not implemented');
    },
};
export const testDataProvider = (
    overrides?: Partial<DataProvider>
): DataProvider => ({
    ...defaultTestDataProvider,
    ...overrides,
});
