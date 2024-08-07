import {
    CreateResult,
    DataProvider,
    DeleteResult,
    GetOneResult,
    UpdateResult,
} from '../types';

// avoids adding a context in tests
export const defaultDataProvider: DataProvider = {
    create: () => Promise.resolve<CreateResult>({ data: null }),
    delete: () => Promise.resolve<DeleteResult>({ data: null }),
    deleteMany: () => Promise.resolve({ data: [] }),
    getList: () => Promise.resolve({ data: [], total: 0 }),
    getMany: () => Promise.resolve({ data: [] }),
    getManyReference: () => Promise.resolve({ data: [], total: 0 }),
    getOne: () => Promise.resolve<GetOneResult>({ data: null }),
    update: () => Promise.resolve<UpdateResult>({ data: null }),
    updateMany: () => Promise.resolve({ data: [] }),
};
