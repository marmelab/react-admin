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

            newParams = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeGetList',
                newParams
            );
            let result = await dataProvider.getList<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterGetList',
                result
            );
            result.data = await Promise.all(
                result.data.map(record =>
                    applyCallbacks(
                        dataProvider,
                        handlers,
                        resource,
                        'afterRead',
                        record
                    )
                )
            );

            return result;
        },

        getOne: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: GetOneParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeGetOne',
                newParams
            );
            let result = await dataProvider.getOne<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterGetOne',
                result
            );
            result.data = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterRead',
                result.data
            );

            return result;
        },

        getMany: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyParams
        ) {
            let newParams = params;

            newParams = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeGetMany',
                newParams
            );
            let result = await dataProvider.getMany<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterGetMany',
                result
            );
            result.data = await Promise.all(
                result.data.map(record =>
                    applyCallbacks(
                        dataProvider,
                        handlers,
                        resource,
                        'afterRead',
                        record
                    )
                )
            );

            return result;
        },

        getManyReference: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyReferenceParams
        ) {
            let newParams = params;

            newParams = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeGetManyReference',
                newParams
            );
            let result = await dataProvider.getManyReference<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterGetManyReference',
                result
            );
            result.data = await Promise.all(
                result.data.map(record =>
                    applyCallbacks(
                        dataProvider,
                        handlers,
                        resource,
                        'afterRead',
                        record
                    )
                )
            );
            return result;
        },

        update: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: UpdateParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeUpdate',
                newParams
            );
            newParams.data = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeSave',
                newParams.data
            );
            let result = await dataProvider.update<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterUpdate',
                result
            );
            result.data = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterSave',
                result.data
            );

            return result;
        },

        create: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: CreateParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeCreate',
                newParams
            );
            newParams.data = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeSave',
                newParams.data
            );
            let result = await dataProvider.create<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterCreate',
                result
            );
            result = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterSave',
                result
            );

            return result;
        },

        delete: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: DeleteParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeDelete',
                newParams
            );
            let result = await dataProvider.delete<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterDelete',
                result
            );

            return result;
        },

        updateMany: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: UpdateManyParams<RecordType>
        ) {
            let newParams = params;

            newParams = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeUpdateMany',
                newParams
            );
            let result = await dataProvider.updateMany<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterUpdateMany',
                result
            );

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
                        applyCallbacks(
                            dataProvider,
                            handlers,
                            resource,
                            'afterSave',
                            record
                        )
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

            newParams = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'beforeDeleteMany',
                newParams
            );
            let result = await dataProvider.deleteMany<RecordType>(
                resource,
                newParams
            );
            result = await applyCallbacks(
                dataProvider,
                handlers,
                resource,
                'afterDeleteMany',
                result
            );

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
export const applyCallbacks = async function <U>(
    dataProvider: DataProvider,
    handlers: ResourceCallbacks[],
    resource: string,
    hook: string,
    params: U
): Promise<U> {
    let newParams = params;
    const handlersToApply = handlers.filter(
        h => (h.resource === resource || h.resource === '*') && h[hook]
    );
    for (let handler of handlersToApply) {
        const callbacksValue: ResourceCallbacksValue<any> = handler[hook];
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

/**
 * The list of all possible data provider hooks
 * @see https://marmelab.com/react-admin/DataProviders.html#data-provider-hooks
 */
export enum dataProviderHooks {
    afterCreate = 'afterCreate',
    afterDelete = 'afterDelete',
    afterDeleteMany = 'afterDeleteMany',
    afterGetList = 'afterGetList',
    afterGetMany = 'afterGetMany',
    afterGetManyReference = 'afterGetManyReference',
    afterGetOne = 'afterGetOne',
    afterUpdate = 'afterUpdate',
    afterUpdateMany = 'afterUpdateMany',
    beforeCreate = 'beforeCreate',
    beforeDelete = 'beforeDelete',
    beforeDeleteMany = 'beforeDeleteMany',
    beforeGetList = 'beforeGetList',
    beforeGetMany = 'beforeGetMany',
    beforeGetManyReference = 'beforeGetManyReference',
    beforeGetOne = 'beforeGetOne',
    beforeUpdate = 'beforeUpdate',
    beforeUpdateMany = 'beforeUpdateMany',
    beforeSave = 'beforeSave',
    afterRead = 'afterRead',
    afterSave = 'afterSave',
}
