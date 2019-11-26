export default {
    create: () => Promise.resolve({ data: {} }), // avoids adding a context in tests
    delete: () => Promise.resolve({ data: {} }), // avoids adding a context in tests
    deleteMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
    getList: () => Promise.resolve({ data: [], total: 0 }), // avoids adding a context in tests
    getMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
    getManyReference: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
    getOne: () => Promise.resolve({ data: {} }), // avoids adding a context in tests
    update: () => Promise.resolve({ data: {} }), // avoids adding a context in tests
    updateMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
};
