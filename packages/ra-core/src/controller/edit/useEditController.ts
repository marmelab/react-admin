import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { UseQueryOptions, UseMutationOptions } from 'react-query';

import { useAuthenticated } from '../../auth';
import { RaRecord, MutationMode, TransformData } from '../../types';
import { useRedirect, RedirectionSideEffect } from '../../routing';
import { useNotify } from '../../notification';
import {
    useGetOne,
    useUpdate,
    useRefresh,
    UseGetOneHookValue,
    UseUpdateMutateParams,
    HttpError,
} from '../../dataProvider';
import { useTranslate } from '../../i18n';
import {
    useResourceContext,
    useGetResourceLabel,
    useGetRecordRepresentation,
} from '../../core';
import { SaveContextValue, useMutationMiddlewares } from '../saveContext';

/**
 * Prepare data for the Edit view.
 *
 * useEditController does a few things:
 * - it grabs the id from the URL and the resource name from the ResourceContext,
 * - it fetches the record via useGetOne,
 * - it prepares the page title.
 *
 * @param {Object} props The props passed to the Edit component.
 *
 * @return {Object} controllerProps Fetched data and callbacks for the Edit view
 *
 * @example
 *
 * import { useEditController } from 'react-admin';
 * import EditView from './EditView';
 *
 * const MyEdit = () => {
 *     const controllerProps = useEditController({ resource: 'posts', id: 123 });
 *     return <EditView {...controllerProps} {...props} />;
 * }
 */
export const useEditController = <
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
>(
    props: EditControllerProps<RecordType, MutationOptionsError> = {}
): EditControllerResult<RecordType> => {
    const {
        disableAuthentication,
        id: propsId,
        mutationMode = 'undoable',
        mutationOptions = {},
        queryOptions = {},
        redirect: redirectTo = DefaultRedirect,
        transform,
    } = props;
    useAuthenticated({ enabled: !disableAuthentication });
    const resource = useResourceContext(props);
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const { id: routeId } = useParams<'id'>();
    const id = propsId != null ? propsId : decodeURIComponent(routeId);
    const { meta: queryMeta, ...otherQueryOptions } = queryOptions;
    const {
        onSuccess,
        onError,
        meta: mutationMeta,
        ...otherMutationOptions
    } = mutationOptions;
    const {
        registerMutationMiddleware,
        getMutateWithMiddlewares,
        unregisterMutationMiddleware,
    } = useMutationMiddlewares();
    const { data: record, error, isLoading, isFetching, refetch } = useGetOne<
        RecordType
    >(
        resource,
        { id, meta: queryMeta },
        {
            onError: () => {
                notify('ra.notification.item_doesnt_exist', {
                    type: 'error',
                });
                redirect('list', resource);
                refresh();
            },
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: false,
            ...otherQueryOptions,
        }
    );

    // eslint-disable-next-line eqeqeq
    if (record && record.id && record.id != id) {
        throw new Error(
            `useEditController: Fetched record's id attribute (${record.id}) must match the requested 'id' (${id})`
        );
    }

    const getResourceLabel = useGetResourceLabel();
    const recordRepresentation = getRecordRepresentation(record);
    const defaultTitle = translate('ra.page.edit', {
        name: getResourceLabel(resource, 1),
        id,
        record,
        recordRepresentation:
            typeof recordRepresentation === 'string'
                ? recordRepresentation
                : '',
    });

    const recordCached = { id, previousData: record };

    const [update, { isLoading: saving }] = useUpdate<
        RecordType,
        MutationOptionsError
    >(resource, recordCached, {
        ...otherMutationOptions,
        mutationMode,
        returnPromise: mutationMode === 'pessimistic',
    });

    const save = useCallback(
        (
            data: Partial<RecordType>,
            {
                onSuccess: onSuccessFromSave,
                onError: onErrorFromSave,
                transform: transformFromSave,
                meta: metaFromSave,
            } = {}
        ) =>
            Promise.resolve(
                transformFromSave
                    ? transformFromSave(data, {
                          previousData: recordCached.previousData,
                      })
                    : transform
                    ? transform(data, {
                          previousData: recordCached.previousData,
                      })
                    : data
            ).then(async (data: Partial<RecordType>) => {
                const mutate = getMutateWithMiddlewares(update);

                try {
                    await mutate(
                        resource,
                        { id, data, meta: metaFromSave ?? mutationMeta },
                        {
                            onSuccess: async (data, variables, context) => {
                                if (onSuccessFromSave) {
                                    return onSuccessFromSave(
                                        data,
                                        variables,
                                        context
                                    );
                                }

                                if (onSuccess) {
                                    return onSuccess(data, variables, context);
                                }

                                notify('ra.notification.updated', {
                                    type: 'info',
                                    messageArgs: { smart_count: 1 },
                                    undoable: mutationMode === 'undoable',
                                });
                                redirect(redirectTo, resource, data.id, data);
                            },
                            onError: onErrorFromSave
                                ? onErrorFromSave
                                : onError
                                ? onError
                                : (error: Error | string) => {
                                      notify(
                                          typeof error === 'string'
                                              ? error
                                              : error.message ||
                                                    'ra.notification.http_error',
                                          {
                                              type: 'error',
                                              messageArgs: {
                                                  _:
                                                      typeof error === 'string'
                                                          ? error
                                                          : error &&
                                                            error.message
                                                          ? error.message
                                                          : undefined,
                                              },
                                          }
                                      );
                                  },
                        }
                    );
                } catch (error) {
                    if ((error as HttpError).body?.errors != null) {
                        return (error as HttpError).body.errors;
                    }
                }
            }),
        [
            id,
            getMutateWithMiddlewares,
            mutationMeta,
            mutationMode,
            notify,
            onError,
            onSuccess,
            redirect,
            redirectTo,
            resource,
            transform,
            update,
            recordCached.previousData,
        ]
    );

    return {
        defaultTitle,
        error,
        isFetching,
        isLoading,
        mutationMode,
        record,
        redirect: redirectTo,
        refetch,
        registerMutationMiddleware,
        resource,
        save,
        saving,
        unregisterMutationMiddleware,
    };
};

export interface EditControllerProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> {
    disableAuthentication?: boolean;
    id?: RecordType['id'];
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        UseUpdateMutateParams<RecordType>
    > & { meta?: any };
    queryOptions?: UseQueryOptions<RecordType> & { meta?: any };
    redirect?: RedirectionSideEffect;
    resource?: string;
    transform?: TransformData;
    [key: string]: any;
}

export interface EditControllerResult<RecordType extends RaRecord = any>
    extends SaveContextValue {
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data?: RecordType;
    error?: any;
    defaultTitle: string;
    isFetching: boolean;
    isLoading: boolean;
    record?: RecordType;
    refetch: UseGetOneHookValue<RecordType>['refetch'];
    redirect: RedirectionSideEffect;
    resource: string;
}

const DefaultRedirect = 'list';
