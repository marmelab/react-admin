import { DataProvider } from '../types';

/**
 * A dataProvider meant to be used in tests only. You can override any of its methods by passing a partial dataProvider.
 */
export const testDataProvider = (
    overrides?: Partial<DataProvider>
): DataProvider => {
    return {
        getList: () => Promise.resolve({ data: [], total: 0 }),
        getOne: () => Promise.resolve({ data: undefined }),
        getMany: () => Promise.resolve({ data: [] }),
        getManyReference: () => Promise.resolve({ data: [], total: 0 }),
        create: () => Promise.resolve({ data: undefined }),
        update: () => Promise.resolve({ data: undefined }),
        updateMany: () => Promise.resolve({ data: [] }),
        delete: () => Promise.resolve({ data: undefined }),
        deleteMany: () => Promise.resolve({ data: [] }),
        ...overrides,
    };
};
