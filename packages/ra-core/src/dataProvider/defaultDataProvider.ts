import { DataProvider } from '../types';

// avoids adding a context in tests
export const defaultDataProvider: DataProvider = {
    create: async () => {
        throw new Error('not implemented');
    },
    delete: async () => {
        throw new Error('not implemented');
    },
    deleteMany: async () => {
        throw new Error('not implemented');
    },
    getList: async () => {
        throw new Error('not implemented');
    },
    getMany: async () => {
        throw new Error('not implemented');
    },
    getManyReference: async () => {
        throw new Error('not implemented');
    },
    getOne: async () => {
        throw new Error('not implemented');
    },
    update: async () => {
        throw new Error('not implemented');
    },
    updateMany: async () => {
        throw new Error('not implemented');
    },
};
