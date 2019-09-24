import {
    CREATE,
    DELETE,
    DELETE_MANY,
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    UPDATE,
    UPDATE_MANY,
} from '../dataFetchActions';
import { LegacyDataProvider, DataProvider } from '../types';

const defaultDataProvider = {
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

const fetchMap = {
    create: CREATE,
    delete: DELETE,
    deleteMany: DELETE_MANY,
    getList: GET_LIST,
    getMany: GET_MANY,
    getManyReference: GET_MANY_REFERENCE,
    getOne: GET_ONE,
    update: UPDATE,
    updateMany: UPDATE_MANY,
};

/**
 * Turn a function-based dataProvider to an object-based one
 *
 * Allows using legacy dataProviders transparently.
 *
 * @param {Function} dataProvider A legacy dataProvider (type, resource, params) => Promise<any>
 *
 * @returns {Object} An dataProvider that react-admin can use
 */
const convertLegacyDataProvider = (
    legacyDataProvider: LegacyDataProvider
): DataProvider => {
    const proxy = new Proxy(defaultDataProvider, {
        get(_, name) {
            return (resource, params) => {
                if (Object.keys(fetchMap).includes(name.toString())) {
                    const fetchType = fetchMap[name.toString()];
                    return legacyDataProvider(fetchType, resource, params);
                }

                return legacyDataProvider(name.toString(), resource, params);
            };
        },
    });

    return proxy;
};

export default convertLegacyDataProvider;
