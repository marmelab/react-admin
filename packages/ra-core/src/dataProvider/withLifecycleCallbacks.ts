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
 * @property {AfterCreate} [afterCreate] A callback executed after create
 * @property {AfterDelete} [afterDelete] A callback executed after delete
 * @property {AfterDeleteMany} [afterDeleteMany] A callback executed after deleteMany
 * @property {AfterGetList} [afterGetList] A callback executed after getList
 * @property {AfterGetMany} [afterGetMany] A callback executed after getMany
 * @property {AfterGetManyReference} [afterGetManyReference] A callback executed after getManyReference
 * @property {AfterGetOne} [afterGetOne] A callback executed after getOne
 * @property {AfterRead} [afterRead] A callback executed after read (getList, getMany, getManyReference, getOne)
 * @property {AfterSave} [afterSave] A callback executed after save (create, update, updateMany)
 * @property {AfterUpdate} [afterUpdate] A callback executed after update
 * @property {AfterUpdateMany} [afterUpdateMany] A callback executed after updateMany
 * @property {BeforeCreate} [beforeCreate] A callback executed before create
 * @property {BeforeDelete} [beforeDelete] A callback executed before delete
 * @property {BeforeDeleteMany} [beforeDeleteMany] A callback executed before deleteMany
 * @property {BeforeGetList} [beforeGetList] A callback executed before getList
 * @property {BeforeGetMany} [beforeGetMany] A callback executed before getMany
 * @property {BeforeGetManyReference} [beforeGetManyReference] A callback executed before getManyReference
 * @property {BeforeGetOne} [beforeGetOne] A callback executed before getOne
 * @property {BeforeSave} [beforeSave] A callback executed before save (create, update, updateMany)
 * @property {BeforeUpdate} [beforeUpdate] A callback executed before update
 * @property {BeforeUpdateMany} [beforeUpdateMany] A callback executed before updateMany
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
 *       afterRead: async (data, dataProvider) => {
 *         // rename field to the record
 *         data.user_id = data.userId;
 *         return data;
 *       },
 *       // executed after create, update and updateMany
 *       afterSave: async (record, dataProvider) => {
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
 *       beforeDelete: async (params, dataProvider) => {
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
            const beforeGetListHandlers = handlers.filter(
                h => h.resource === resource && h.beforeGetList
            );
            for (let handler of beforeGetListHandlers) {
                newParams = await handler.beforeGetList(
                    newParams,
                    dataProvider
                );
            }

            let result = await dataProvider.getList<RecordType>(
                resource,
                newParams
            );

            const afterGetListHandlers = handlers.filter(
                h => h.resource === resource && h.afterGetList
            );
            for (let handler of afterGetListHandlers) {
                result = await handler.afterGetList(result, dataProvider);
            }
            const afterReadHandlers = handlers.filter(
                h => h.resource === resource && h.afterRead
            );
            for (let handler of afterReadHandlers) {
                result.data = await Promise.all(
                    result.data.map(record =>
                        handler.afterRead(record, dataProvider)
                    )
                );
            }

            return result;
        },

        getOne: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: GetOneParams<RecordType>
        ) {
            let newParams = params;
            const beforeGetOneHandlers = handlers.filter(
                h => h.resource === resource && h.beforeGetOne
            );
            for (let handler of beforeGetOneHandlers) {
                newParams = await handler.beforeGetOne(newParams, dataProvider);
            }

            let result = await dataProvider.getOne<RecordType>(
                resource,
                newParams
            );

            const afterGetOneHandlers = handlers.filter(
                h => h.resource === resource && h.afterGetOne
            );
            for (let handler of afterGetOneHandlers) {
                result = await handler.afterGetOne(result, dataProvider);
            }
            const afterReadHandlers = handlers.filter(
                h => h.resource === resource && h.afterRead
            );
            for (let handler of afterReadHandlers) {
                result.data = await handler.afterRead(
                    result.data,
                    dataProvider
                );
            }

            return result;
        },

        getMany: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyParams
        ) {
            let newParams = params;
            const beforeGetManyHandlers = handlers.filter(
                h => h.resource === resource && h.beforeGetMany
            );
            for (let handler of beforeGetManyHandlers) {
                newParams = await handler.beforeGetMany(
                    newParams,
                    dataProvider
                );
            }

            let result = await dataProvider.getMany<RecordType>(
                resource,
                newParams
            );

            const afterGetManyHandlers = handlers.filter(
                h => h.resource === resource && h.afterGetMany
            );
            for (let handler of afterGetManyHandlers) {
                result = await handler.afterGetMany(result, dataProvider);
            }
            const afterReadHandlers = handlers.filter(
                h => h.resource === resource && h.afterRead
            );
            for (let handler of afterReadHandlers) {
                result.data = await Promise.all(
                    result.data.map(record =>
                        handler.afterRead(record, dataProvider)
                    )
                );
            }

            return result;
        },

        getManyReference: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyReferenceParams
        ) {
            let newParams = params;
            const beforeGetManyReferenceHandlers = handlers.filter(
                h => h.resource === resource && h.beforeGetManyReference
            );
            for (let handler of beforeGetManyReferenceHandlers) {
                newParams = await handler.beforeGetManyReference(
                    newParams,
                    dataProvider
                );
            }

            let result = await dataProvider.getManyReference<RecordType>(
                resource,
                newParams
            );

            const afterGetManyReferenceHandlers = handlers.filter(
                h => h.resource === resource && h.afterGetManyReference
            );
            for (let handler of afterGetManyReferenceHandlers) {
                result = await handler.afterGetManyReference(
                    result,
                    dataProvider
                );
            }
            const afterReadHandlers = handlers.filter(
                h => h.resource === resource && h.afterRead
            );
            for (let handler of afterReadHandlers) {
                result.data = await Promise.all(
                    result.data.map(record =>
                        handler.afterRead(record, dataProvider)
                    )
                );
            }

            return result;
        },

        update: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: UpdateParams<RecordType>
        ) {
            let newParams = params;
            const beforeUpdateHandlers = handlers.filter(
                h => h.resource === resource && h.beforeUpdate
            );
            for (let handler of beforeUpdateHandlers) {
                newParams = await handler.beforeUpdate(newParams, dataProvider);
            }
            const beforeSaveHandlers = handlers.filter(
                h => h.resource === resource && h.beforeSave
            );
            for (let handler of beforeSaveHandlers) {
                newParams.data = await handler.beforeSave(
                    newParams.data,
                    dataProvider
                );
            }

            let result = await dataProvider.update<RecordType>(
                resource,
                newParams
            );

            const afterUpdateHandlers = handlers.filter(
                h => h.resource === resource && h.afterUpdate
            );
            for (let handler of afterUpdateHandlers) {
                result = await handler.afterUpdate(result, dataProvider);
            }
            const afterSaveHandlers = handlers.filter(
                h => h.resource === resource && h.afterSave
            );
            for (let handler of afterSaveHandlers) {
                result.data = await handler.afterSave(
                    result.data,
                    dataProvider
                );
            }

            return result;
        },

        create: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: CreateParams<RecordType>
        ) {
            let newParams = params;
            const beforeCreateHandlers = handlers.filter(
                h => h.resource === resource && h.beforeCreate
            );
            for (let handler of beforeCreateHandlers) {
                newParams = await handler.beforeCreate(newParams, dataProvider);
            }
            const beforeSaveHandlers = handlers.filter(
                h => h.resource === resource && h.beforeSave
            );
            for (let handler of beforeSaveHandlers) {
                newParams.data = await handler.beforeSave(
                    newParams.data,
                    dataProvider
                );
            }

            let result = await dataProvider.create<RecordType>(
                resource,
                newParams
            );

            const afterCreateHandlers = handlers.filter(
                h => h.resource === resource && h.afterCreate
            );
            for (let handler of afterCreateHandlers) {
                result = await handler.afterCreate(result, dataProvider);
            }
            const afterSaveHandlers = handlers.filter(
                h => h.resource === resource && h.afterSave
            );
            for (let handler of afterSaveHandlers) {
                result.data = await handler.afterSave(
                    result.data,
                    dataProvider
                );
            }

            return result;
        },

        delete: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: DeleteParams<RecordType>
        ) {
            let newParams = params;
            const beforeDeleteHandlers = handlers.filter(
                h => h.resource === resource && h.beforeDelete
            );
            for (let handler of beforeDeleteHandlers) {
                newParams = await handler.beforeDelete(newParams, dataProvider);
            }

            let result = await dataProvider.delete<RecordType>(
                resource,
                newParams
            );

            const afterDeleteHandlers = handlers.filter(
                h => h.resource === resource && h.afterDelete
            );
            for (let handler of afterDeleteHandlers) {
                result = await handler.afterDelete(result, dataProvider);
            }

            return result;
        },

        updateMany: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: UpdateManyParams<RecordType>
        ) {
            let newParams = params;
            const beforeUpdateManyHandlers = handlers.filter(
                h => h.resource === resource && h.beforeUpdateMany
            );
            for (let handler of beforeUpdateManyHandlers) {
                newParams = await handler.beforeUpdateMany(
                    newParams,
                    dataProvider
                );
            }
            const beforeSaveHandlers = handlers.filter(
                h => h.resource === resource && h.beforeSave
            );
            for (let handler of beforeSaveHandlers) {
                newParams.data = await handler.beforeSave(
                    newParams.data,
                    dataProvider
                );
            }

            let result = await dataProvider.updateMany<RecordType>(
                resource,
                newParams
            );

            const afterUpdateManyHandlers = handlers.filter(
                h => h.resource === resource && h.afterUpdateMany
            );
            for (let handler of afterUpdateManyHandlers) {
                result = await handler.afterUpdateMany(result, dataProvider);
            }
            const afterSaveHandlers = handlers.filter(
                h => h.resource === resource && h.afterSave
            );
            if (afterSaveHandlers.length > 0) {
                const { data: records } = await dataProvider.getMany(resource, {
                    ids: result.data,
                });

                for (let handler of afterSaveHandlers) {
                    await Promise.all(
                        records.map(record =>
                            handler.afterSave(record, dataProvider)
                        )
                    );
                }
            }

            return result;
        },

        deleteMany: async function <RecordType extends RaRecord = any>(
            resource: string,
            params: DeleteManyParams<RecordType>
        ) {
            let newParams = params;
            const beforeDeleteManyHandlers = handlers.filter(
                h => h.resource === resource && h.beforeDeleteMany
            );
            for (let handler of beforeDeleteManyHandlers) {
                newParams = await handler.beforeDeleteMany(
                    newParams,
                    dataProvider
                );
            }

            let result = await dataProvider.deleteMany<RecordType>(
                resource,
                newParams
            );

            const afterDeleteManyHandlers = handlers.filter(
                h => h.resource === resource && h.afterDeleteMany
            );
            for (let handler of afterDeleteManyHandlers) {
                result = await handler.afterDeleteMany(result, dataProvider);
            }

            return result;
        },
    };
};

export type ResourceCallbacks<T extends RaRecord = any> = {
    resource: string;
    afterCreate?: (
        result: CreateResult<T>,
        dataProvider: DataProvider
    ) => Promise<CreateResult<T>>;
    afterDelete?: (
        result: DeleteResult<T>,
        dataProvider: DataProvider
    ) => Promise<DeleteResult<T>>;
    afterDeleteMany?: (
        result: DeleteManyResult<T>,
        dataProvider: DataProvider
    ) => Promise<DeleteManyResult<T>>;
    afterGetList?: (
        result: GetListResult<T>,
        dataProvider: DataProvider
    ) => Promise<GetListResult<T>>;
    afterGetMany?: (
        result: GetManyResult<T>,
        dataProvider: DataProvider
    ) => Promise<GetManyResult<T>>;
    afterGetManyReference?: (
        result: GetManyReferenceResult<T>,
        dataProvider: DataProvider
    ) => Promise<GetManyReferenceResult<T>>;
    afterGetOne?: (
        result: GetOneResult<T>,
        dataProvider: DataProvider
    ) => Promise<GetOneResult<T>>;
    afterUpdate?: (
        result: UpdateResult<T>,
        dataProvider: DataProvider
    ) => Promise<UpdateResult<T>>;
    afterUpdateMany?: (
        result: UpdateManyResult<T>,
        dataProvider: DataProvider
    ) => Promise<UpdateManyResult<T>>;
    beforeCreate?: (
        params: CreateParams<T>,
        dataProvider: DataProvider
    ) => Promise<CreateParams<T>>;
    beforeDelete?: (
        params: DeleteParams<T>,
        dataProvider: DataProvider
    ) => Promise<DeleteParams<T>>;
    beforeDeleteMany?: (
        params: DeleteManyParams<T>,
        dataProvider: DataProvider
    ) => Promise<DeleteManyParams<T>>;
    beforeGetList?: (
        params: GetListParams,
        dataProvider: DataProvider
    ) => Promise<GetListParams>;
    beforeGetMany?: (
        params: GetManyParams,
        dataProvider: DataProvider
    ) => Promise<GetManyParams>;
    beforeGetManyReference?: (
        params: GetManyReferenceParams,
        dataProvider: DataProvider
    ) => Promise<GetManyReferenceParams>;
    beforeGetOne?: (
        params: GetOneParams<T>,
        dataProvider: DataProvider
    ) => Promise<GetOneParams<T>>;
    beforeUpdate?: (
        params: UpdateParams<T>,
        dataProvider: DataProvider
    ) => Promise<UpdateParams<T>>;
    beforeUpdateMany?: (
        params: UpdateManyParams<T>,
        dataProvider: DataProvider
    ) => Promise<UpdateManyParams<T>>;

    // The following hooks don't match a dataProvider method

    /**
     * Modify the data before it is sent to the dataProvider.
     *
     * Used in create, update, and updateMany
     *
     * Note: This callback doesn't modify the record itself, but the data argument
     * (which may be a diff, especially when called with updateMany).
     */
    beforeSave?: (
        data: Partial<T>,
        dataProvider: DataProvider
    ) => Promise<Partial<T>>;
    /**
     * Update a record after it has been read from the dataProvider
     *
     * Used in getOne, getList, getMany, and getManyReference
     */
    afterRead?: (record: T, dataProvider: DataProvider) => Promise<T>;
    /**
     * Use the record after it is returned by the dataProvider.
     *
     * Used in create, update, and updateMany
     */
    afterSave?: (record: T, dataProvider: DataProvider) => Promise<T>;
};
