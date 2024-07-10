import {
    CreateParams,
    CreateResult,
    DataProvider,
    DeleteManyParams,
    DeleteManyResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetManyParams,
    GetManyReferenceParams,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
    RaRecord,
    UpdateManyParams,
    UpdateManyResult,
    UpdateParams,
    UpdateResult,
} from '../types';

/**
 * Extend a dataProvider to execute callbacks before and after read and write calls.
 *
 * @param {DataProvider} dataProvider The dataProvider to wrap
 * @param {ResourceCallbacks[]} handlers An array of ResourceCallbacks
 *
 * @typedef {Object} ResourceCallbacks
 * @property {string} resource The resource name
 * @property {AfterCreate} [afterCreate] A callback (or array of callbacks) executed after create
 * @property {AfterDelete} [afterDelete] A callback (or array of callbacks) executed after delete
 * @property {AfterDeleteMany} [afterDeleteMany] A callback (or array of callbacks) executed after deleteMany
 * @property {AfterGetList} [afterGetList] A callback (or array of callbacks) executed after getList
 * @property {AfterGetMany} [afterGetMany] A callback (or array of callbacks) executed after getMany
 * @property {AfterGetManyReference} [afterGetManyReference] A callback (or array of callbacks) executed after getManyReference
 * @property {AfterGetOne} [afterGetOne] A callback (or array of callbacks) executed after getOne
 * @property {AfterRead} [afterRead] A callback (or array of callbacks) executed after read (getList, getMany, getManyReference, getOne)
 * @property {AfterSave} [afterSave] A callback (or array of callbacks) executed after save (create, update, updateMany)
 * @property {AfterUpdate} [afterUpdate] A callback (or array of callbacks) executed after update
 * @property {AfterUpdateMany} [afterUpdateMany] A callback (or array of callbacks) executed after updateMany
 * @property {BeforeCreate} [beforeCreate] A callback (or array of callbacks) executed before create
 * @property {BeforeDelete} [beforeDelete] A callback (or array of callbacks) executed before delete
 * @property {BeforeDeleteMany} [beforeDeleteMany] A callback (or array of callbacks) executed before deleteMany
 * @property {BeforeGetList} [beforeGetList] A callback (or array of callbacks) executed before getList
 * @property {BeforeGetMany} [beforeGetMany] A callback (or array of callbacks) executed before getMany
 * @property {BeforeGetManyReference} [beforeGetManyReference] A callback (or array of callbacks) executed before getManyReference
 * @property {BeforeGetOne} [beforeGetOne] A callback (or array of callbacks) executed before getOne
 * @property {BeforeSave} [beforeSave] A callback (or array of callbacks) executed before save (create, update, updateMany)
 * @property {BeforeUpdate} [beforeUpdate] A callback (or array of callbacks) executed before update
 * @property {BeforeUpdateMany} [beforeUpdateMany] A callback (or array of callbacks) executed before updateMany
 *
 * Warnings:
 * - As queries issued in the callbacks are not done through react-query,
 *   any change in the data will not be automatically reflected in the UI.
 * - The callbacks are not executed in a transaction. In case of error,
 *   the backend may be left in an inconsistent state.
 * - When calling the API directly using fetch or another client,
 *   the callbacks will not be executed, leaving the backend in a possibly inconsistent state.
 * - If a callback triggers the query it's listening to, this will lead to a infinite loop.
 *
 * @example
 *
 * const dataProvider = withLifecycleCallbacks(
 *   jsonServerProvider("http://localhost:3000"),
 *   [
 *     {
 *       resource: "posts",
 *       afterRead: async (data, dataProvider, resource) => {
 *         // rename field to the record
 *         data.user_id = data.userId;
 *         return data;
 *       },
 *       // executed after create, update and updateMany
 *       afterSave: async (record, dataProvider, resource) => {
 *         // update the author's nb_posts
 *         const { total } = await dataProvider.getList("users", {
 *           filter: { id: record.user_id },
 *           pagination: { page: 1, perPage: 1 },
 *         });
 *         await dataProvider.update("users", {
 *           id: user.id,
 *           data: { nb_posts: total },
 *           previousData: user,
 *         });
 *         return record;
 *       },
 *       beforeDelete: async (params, dataProvider, resource) => {
 *         // delete all comments linked to the post
 *         const { data: comments } = await dataProvider.getManyReference(
 *           "comments",
 *           {
 *             target: "post_id",
 *             id: params.id,
 *           }
 *         );
 *         if (comments.length > 0) {
 *           await dataProvider.deleteMany("comments", {
 *             ids: comments.map((comment) => comment.id),
 *           });
 *         }
 *         // update the author's nb_posts
 *         const { data: post } = await dataProvider.getOne("posts", {
 *           id: params.id,
 *         });
 *         const { total } = await dataProvider.getList("users", {
 *           filter: { id: post.user_id },
 *           pagination: { page: 1, perPage: 1 },
 *         });
 *         await dataProvider.update("users", {
 *           id: user.id,
 *           data: { nb_posts: total - 1 },
 *           previousData: user,
 *         });
 *         return params;
 *       },
 *     },
 *   ]
 * );
 */
export const withLifecycleCallbacks = (
    dataProvider: DataProvider,
    handlers: ResourceCallbacks[]
): DataProvider => {
    return {
        ...dataProvider,

        getList: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: GetListParams
        ) {
            let newParams = params;

            newParams = await applyCallbacks({
                name: 'beforeGetList',
                params: newParams,
                dataProvider,
                handlers,
                resource,
            });
            let result = await dataProvider.getList<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks({
                name: 'afterGetList',
                params: result,
                dataProvider,
                handlers,
                resource,
            });
            result.data = await Promise.all(
                result.data.map(record =>
                    applyCallbacks({
                        name: 'afterRead',
                        params: record,
                        dataProvider,
                        handlers,
                        resource,
                    })
                )
            );

            return result;
        },

        getOne: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: GetOneParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks({
                name: 'beforeGetOne',
                params: newParams,
                dataProvider,
                handlers,
                resource,
            });
            let result = await dataProvider.getOne<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks({
                name: 'afterGetOne',
                params: result,
                dataProvider,
                handlers,
                resource,
            });
            result.data = await applyCallbacks({
                name: 'afterRead',
                params: result.data,
                dataProvider,
                handlers,
                resource,
            });

            return result;
        },

        getMany: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks({
                name: 'beforeGetMany',
                params: newParams,
                dataProvider,
                handlers,
                resource,
            });
            let result = await dataProvider.getMany<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks({
                name: 'afterGetMany',
                params: result,
                dataProvider,
                handlers,
                resource,
            });
            result.data = await Promise.all(
                result.data.map(record =>
                    applyCallbacks({
                        name: 'afterRead',
                        params: record,
                        dataProvider,
                        handlers,
                        resource,
                    })
                )
            );

            return result;
        },

        getManyReference: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyReferenceParams
        ) {
            let newParams = params;

            newParams = await applyCallbacks({
                name: 'beforeGetManyReference',
                params: newParams,
                dataProvider,
                handlers,
                resource,
            });
            let result = await dataProvider.getManyReference<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks({
                name: 'afterGetManyReference',
                params: result,
                dataProvider,
                handlers,
                resource,
            });
            result.data = await Promise.all(
                result.data.map(record =>
                    applyCallbacks({
                        name: 'afterRead',
                        params: record,
                        dataProvider,
                        handlers,
                        resource,
                    })
                )
            );
            return result;
        },

        update: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: UpdateParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks({
                name: 'beforeUpdate',
                params: newParams,
                dataProvider,
                handlers,
                resource,
            });
            newParams.data = await applyCallbacks({
                name: 'beforeSave',
                params: newParams.data,
                dataProvider,
                handlers,
                resource,
            });
            let result = await dataProvider.update<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks({
                name: 'afterUpdate',
                params: result,
                dataProvider,
                handlers,
                resource,
            });
            result.data = await applyCallbacks({
                name: 'afterSave',
                params: result.data,
                dataProvider,
                handlers,
                resource,
            });

            return result;
        },

        create: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: CreateParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks({
                name: 'beforeCreate',
                params: newParams,
                dataProvider,
                handlers,
                resource,
            });
            newParams.data = await applyCallbacks({
                name: 'beforeSave',
                params: newParams.data,
                dataProvider,
                handlers,
                resource,
            });
            let result = await dataProvider.create<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks({
                name: 'afterCreate',
                params: result,
                dataProvider,
                handlers,
                resource,
            });
            result.data = await applyCallbacks({
                name: 'afterSave',
                params: result.data,
                dataProvider,
                handlers,
                resource,
            });

            return result;
        },

        delete: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: DeleteParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks({
                name: 'beforeDelete',
                params: newParams,
                dataProvider,
                handlers,
                resource,
            });
            let result = await dataProvider.delete<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks({
                name: 'afterDelete',
                params: result,
                dataProvider,
                handlers,
                resource,
            });

            return result;
        },

        updateMany: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: UpdateManyParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks({
                name: 'beforeUpdateMany',
                params: newParams,
                dataProvider,
                handlers,
                resource,
            });

            newParams.data = await applyCallbacks({
                name: 'beforeSave',
                params: newParams.data,
                dataProvider,
                handlers,
                resource,
            });

            let result = await dataProvider.updateMany<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks({
                name: 'afterUpdateMany',
                params: result,
                dataProvider,
                handlers,
                resource,
            });

            const afterSaveHandlers = handlers.filter(
                h =>
                    (h.resource === resource || h.resource === '*') &&
                    h.afterSave
            );

            if (afterSaveHandlers.length > 0) {
                const { data: records } = await dataProvider.getMany(resource, {
                    //@ts-ignore
                    ids: result.data,
                });
                await Promise.all(
                    records.map(record =>
                        applyCallbacks({
                            name: 'afterSave',
                            params: record,
                            dataProvider,
                            handlers,
                            resource,
                        })
                    )
                );
            }

            return result;
        },

        deleteMany: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: DeleteManyParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks({
                name: 'beforeDeleteMany',
                params: newParams,
                dataProvider,
                handlers,
                resource,
            });
            let result = await dataProvider.deleteMany<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks({
                name: 'afterDeleteMany',
                params: result,
                dataProvider,
                handlers,
                resource,
            });

            return result;
        },
    };
};

/**
 * Apply callbacks to the params for the given resource and hook
 * @param {DataProvider} dataProvider The dataProvider
 * @param {ResourceCallbacks[]} handlers An array of ResourceCallbacks
 * @param {string} resource The resource name
 * @param {string} hook The hook name (beforeGetList, afterGetOne, etc.)
 * @param {U} params The params / result to pass to the callbacks
 * @returns {Promise<U>} The params / result after the callbacks have been applied
 */
export const applyCallbacks = async function <U>({
    name,
    params,
    dataProvider,
    handlers,
    resource,
}: {
    name: string;
    params: U;
    dataProvider: DataProvider;
    handlers: ResourceCallbacks[];
    resource: string;
}): Promise<U> {
    let newParams = params;
    const handlersToApply = handlers.filter(
        h => (h.resource === resource || h.resource === '*') && h[name]
    );
    for (let handler of handlersToApply) {
        const callbacksValue: ResourceCallbacksValue<any> = handler[name];
        if (Array.isArray(callbacksValue)) {
            for (let callback of callbacksValue ?? []) {
                newParams = await callback(newParams, dataProvider, resource);
            }
        } else {
            newParams = await callbacksValue(newParams, dataProvider, resource);
        }
    }
    return newParams;
};

export type ResourceCallback<U> = {
    (params: U, dataProvider: DataProvider, resource: string): Promise<U>;
};

export type ResourceCallbacksValue<V> =
    | ResourceCallback<V>
    | ResourceCallback<V>[];

export type ResourceCallbacks<T extends RaRecord = any> = {
    resource: string;
    afterCreate?: ResourceCallbacksValue<CreateResult<T>>;
    afterDelete?: ResourceCallbacksValue<DeleteResult<T>>;
    afterDeleteMany?: ResourceCallbacksValue<DeleteManyResult<T>>;
    afterGetList?: ResourceCallbacksValue<GetListResult<T>>;
    afterGetMany?: ResourceCallbacksValue<GetManyResult<T>>;
    afterGetManyReference?: ResourceCallbacksValue<GetManyReferenceResult<T>>;
    afterGetOne?: ResourceCallbacksValue<GetOneResult<T>>;
    afterUpdate?: ResourceCallbacksValue<UpdateResult<T>>;
    afterUpdateMany?: ResourceCallbacksValue<UpdateManyResult<T>>;
    beforeCreate?: ResourceCallbacksValue<CreateParams<T>>;
    beforeDelete?: ResourceCallbacksValue<DeleteParams<T>>;
    beforeDeleteMany?: ResourceCallbacksValue<DeleteManyParams<T>>;
    beforeGetList?: ResourceCallbacksValue<GetListParams>;
    beforeGetMany?: ResourceCallbacksValue<GetManyParams>;
    beforeGetManyReference?: ResourceCallbacksValue<GetManyReferenceParams>;
    beforeGetOne?: ResourceCallbacksValue<GetOneParams<T>>;
    beforeUpdate?: ResourceCallbacksValue<UpdateParams<T>>;
    beforeUpdateMany?: ResourceCallbacksValue<UpdateManyParams<T>>;

    // The following hooks don't match a dataProvider method

    /**
     * Modify the data before it is sent to the dataProvider.
     *
     * Used in create, update, and updateMany
     *
     * Note: This callback doesn't modify the record itself, but the data argument
     * (which may be a diff, especially when called with updateMany).
     */
    beforeSave?: ResourceCallbacksValue<T>;
    /**
     * Update a record after it has been read from the dataProvider
     *
     * Used in getOne, getList, getMany, and getManyReference
     */
    afterRead?: ResourceCallbacksValue<T>;
    /**
     * Use the record after it is returned by the dataProvider.
     *
     * Used in create, update, and updateMany
     */
    afterSave?: ResourceCallbacksValue<T>;
};
