export default {
    create: () => Promise.resolve(null), // avoids adding a context in tests
    delete: () => Promise.resolve(null), // avoids adding a context in tests
    deleteMany: () => Promise.resolve(null), // avoids adding a context in tests
    getList: () => Promise.resolve(null), // avoids adding a context in tests
    getMany: () => Promise.resolve(null), // avoids adding a context in tests
    getManyReference: () => Promise.resolve(null), // avoids adding a context in tests
    getOne: () => Promise.resolve(null), // avoids adding a context in tests
    update: () => Promise.resolve(null), // avoids adding a context in tests
    updateMany: () => Promise.resolve(null), // avoids adding a context in tests
};
