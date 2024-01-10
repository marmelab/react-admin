/* eslint-disable import/no-anonymous-default-export */
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
 * const dataProvider = await localForageDataProvider();
 *
 * @example // initialize with default data (will be ignored if data has been modified by user)
 *
 * import localForageDataProvider from 'ra-data-local-forage';
 * const dataProvider = await localForageDataProvider({
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
export default async (
    params?: LocalForageDataProviderParams
): Promise<DataProvider> => {
    const {
        defaultData = {},
        prefixLocalForageKey = 'ra-data-local-forage-',
        loggingEnabled = false,
    } = params || {};

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

    const localForageData = await getLocalForageData();
    const data = localForageData ?? defaultData;

    // Persist in localForage
    const updateLocalForage = (resource: string) => {
        localforage.setItem(
            `${prefixLocalForageKey}${resource}`,
            data[resource]
        );
    };

    const baseDataProvider = fakeRestProvider(
        data,
        loggingEnabled
    ) as DataProvider;

    return {
        // read methods are just proxies to FakeRest
        getList: <RecordType extends RaRecord = any>(
            resource: string,
            params: GetListParams
        ) => {
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
        getOne: <RecordType extends RaRecord = any>(
            resource: string,
            params: GetOneParams<any>
        ) => baseDataProvider.getOne<RecordType>(resource, params),
        getMany: <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyParams
        ) => baseDataProvider.getMany<RecordType>(resource, params),
        getManyReference: <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyReferenceParams
        ) =>
            baseDataProvider
                .getManyReference<RecordType>(resource, params)
                .catch(error => {
                    if (error.code === 1) {
                        // undefined collection error: hide the error and return an empty list instead
                        return { data: [], total: 0 };
                    } else {
                        throw error;
                    }
                }),

        // update methods need to persist changes in localForage
        update: <RecordType extends RaRecord = any>(
            resource: string,
            params: UpdateParams<any>
        ) => {
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
        updateMany: (resource: string, params: UpdateManyParams<any>) => {
            params.ids.forEach((id: Identifier) => {
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
        create: <RecordType extends Omit<RaRecord, 'id'> = any>(
            resource: string,
            params: CreateParams<any>
        ) => {
            // we need to call the fakerest provider first to get the generated id
            return baseDataProvider
                .create<RecordType>(resource, params)
                .then(response => {
                    if (!data.hasOwnProperty(resource)) {
                        data[resource] = [];
                    }
                    data[resource].push(response.data);
                    updateLocalForage(resource);
                    return response;
                });
        },
        delete: <RecordType extends RaRecord = any>(
            resource: string,
            params: DeleteParams<RecordType>
        ) => {
            const index = data[resource].findIndex(
                (record: { id: any }) => record.id === params.id
            );
            pullAt(data[resource], [index]);
            updateLocalForage(resource);
            return baseDataProvider.delete<RecordType>(resource, params);
        },
        deleteMany: (resource: string, params: DeleteManyParams<any>) => {
            const indexes = params.ids.map((id: any) =>
                data[resource].findIndex((record: any) => record.id === id)
            );
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
