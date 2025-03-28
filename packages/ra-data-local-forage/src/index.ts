import fakeRestProvider from 'ra-data-fakerest';
import {
    CreateParams,
    DataProvider,
    GetListParams,
    GetOneParams,
    GetManyParams,
    GetManyReferenceParams,
    Identifier,
    DeleteParams,
    RaRecord,
    UpdateParams,
    UpdateManyParams,
    DeleteManyParams,
} from 'ra-core';
import pullAt from 'lodash/pullAt';
import localforage from 'localforage';

/**
 * Respond to react-admin data queries using a localForage for storage.
 *
 * Useful for local-first web apps.
 *
 * @example // initialize with no data
 *
 * import localForageDataProvider from 'ra-data-local-forage';
 * const dataProvider = localForageDataProvider();
 *
 * @example // initialize with default data (will be ignored if data has been modified by user)
 *
 * import localForageDataProvider from 'ra-data-local-forage';
 * const dataProvider = localForageDataProvider({
 *   defaultData: {
 *     posts: [
 *       { id: 0, title: 'Hello, world!' },
 *       { id: 1, title: 'FooBar' },
 *     ],
 *     comments: [
 *       { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
 *       { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
 *     ],
 *   }
 * });
 */
export default (params?: LocalForageDataProviderParams): DataProvider => {
    const {
        defaultData = {},
        prefixLocalForageKey = 'ra-data-local-forage-',
        loggingEnabled = false,
    } = params || {};

    let data: Record<string, any> | undefined;
    let baseDataProvider: DataProvider | undefined;
    let initializePromise: Promise<void> | undefined;

    const getLocalForageData = async (): Promise<any> => {
        const keys = await localforage.keys();
        const keyFiltered = keys.filter(key => {
            return key.includes(prefixLocalForageKey);
        });

        if (keyFiltered.length === 0) {
            return undefined;
        }
        const localForageData: Record<string, any> = {};

        for (const key of keyFiltered) {
            const keyWithoutPrefix = key.replace(prefixLocalForageKey, '');
            const res = await localforage.getItem(key);
            localForageData[keyWithoutPrefix] = res || [];
        }
        return localForageData;
    };

    const initialize = async () => {
        if (!initializePromise) {
            initializePromise = initializeProvider();
        }
        return initializePromise;
    };

    const initializeProvider = async () => {
        const localForageData = await getLocalForageData();
        data = localForageData ?? defaultData;

        baseDataProvider = fakeRestProvider(
            data,
            loggingEnabled
        ) as DataProvider;
    };

    // Persist in localForage
    const updateLocalForage = (resource: string) => {
        if (!data) {
            throw new Error('The dataProvider is not initialized.');
        }
        localforage.setItem(
            `${prefixLocalForageKey}${resource}`,
            data[resource]
        );
    };

    return {
        // read methods are just proxies to FakeRest
        getList: async <RecordType extends RaRecord = any>(
            resource: string,
            params: GetListParams
        ) => {
            await initialize();
            if (!baseDataProvider) {
                throw new Error('The dataProvider is not initialized.');
            }
            return baseDataProvider
                .getList<RecordType>(resource, params)
                .catch(error => {
                    if (error.code === 1) {
                        // undefined collection error: hide the error and return an empty list instead
                        return { data: [], total: 0 };
                    } else {
                        throw error;
                    }
                });
        },
        getOne: async <RecordType extends RaRecord = any>(
            resource: string,
            params: GetOneParams<any>
        ) => {
            await initialize();
            if (!baseDataProvider) {
                throw new Error('The dataProvider is not initialized.');
            }
            return baseDataProvider.getOne<RecordType>(resource, params);
        },
        getMany: async <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyParams<RecordType>
        ) => {
            await initialize();
            if (!baseDataProvider) {
                throw new Error('The dataProvider is not initialized.');
            }
            return baseDataProvider.getMany<RecordType>(resource, params);
        },
        getManyReference: async <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyReferenceParams
        ) => {
            await initialize();
            if (!baseDataProvider) {
                throw new Error('The dataProvider is not initialized.');
            }
            return baseDataProvider
                .getManyReference<RecordType>(resource, params)
                .catch(error => {
                    if (error.code === 1) {
                        // undefined collection error: hide the error and return an empty list instead
                        return { data: [], total: 0 };
                    } else {
                        throw error;
                    }
                });
        },

        // update methods need to persist changes in localForage
        update: async <RecordType extends RaRecord = any>(
            resource: string,
            params: UpdateParams<any>
        ) => {
            await initialize();
            if (!data) {
                throw new Error('The dataProvider is not initialized.');
            }
            if (!baseDataProvider) {
                throw new Error('The dataProvider is not initialized.');
            }

            const index = data[resource].findIndex(
                (record: { id: any }) => record.id === params.id
            );
            data[resource][index] = {
                ...data[resource][index],
                ...params.data,
            };
            updateLocalForage(resource);
            return baseDataProvider.update<RecordType>(resource, params);
        },
        updateMany: async (resource: string, params: UpdateManyParams<any>) => {
            await initialize();
            if (!baseDataProvider) {
                throw new Error('The dataProvider is not initialized.');
            }

            params.ids.forEach((id: Identifier) => {
                if (!data) {
                    throw new Error('The dataProvider is not initialized.');
                }
                const index = data[resource].findIndex(
                    (record: { id: Identifier }) => record.id === id
                );
                data[resource][index] = {
                    ...data[resource][index],
                    ...params.data,
                };
            });
            updateLocalForage(resource);
            return baseDataProvider.updateMany(resource, params);
        },
        create: async <RecordType extends Omit<RaRecord, 'id'> = any>(
            resource: string,
            params: CreateParams<any>
        ) => {
            await initialize();
            if (!baseDataProvider) {
                throw new Error('The dataProvider is not initialized.');
            }
            // we need to call the fakerest provider first to get the generated id
            return baseDataProvider
                .create<RecordType>(resource, params)
                .then(response => {
                    if (!data) {
                        throw new Error('The dataProvider is not initialized.');
                    }
                    if (!data.hasOwnProperty(resource)) {
                        data[resource] = [];
                    }
                    data[resource].push(response.data);
                    updateLocalForage(resource);
                    return response;
                });
        },
        delete: async <RecordType extends RaRecord = any>(
            resource: string,
            params: DeleteParams<RecordType>
        ) => {
            await initialize();
            if (!baseDataProvider) {
                throw new Error('The dataProvider is not initialized.');
            }
            if (!data) {
                throw new Error('The dataProvider is not initialized.');
            }
            const index = data[resource].findIndex(
                (record: { id: any }) => record.id === params.id
            );
            pullAt(data[resource], [index]);
            updateLocalForage(resource);
            return baseDataProvider.delete<RecordType>(resource, params);
        },
        deleteMany: async (resource: string, params: DeleteManyParams<any>) => {
            await initialize();
            if (!baseDataProvider) {
                throw new Error('The dataProvider is not initialized.');
            }
            if (!data) {
                throw new Error('The dataProvider is not initialized.');
            }
            const indexes = params.ids.map((id: any) => {
                if (!data) {
                    throw new Error('The dataProvider is not initialized.');
                }
                return data[resource].findIndex(
                    (record: any) => record.id === id
                );
            });
            pullAt(data[resource], indexes);
            updateLocalForage(resource);
            return baseDataProvider.deleteMany(resource, params);
        },
    };
};

export interface LocalForageDataProviderParams {
    defaultData?: any;
    prefixLocalForageKey?: string;
    loggingEnabled?: boolean;
}
