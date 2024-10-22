import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthenticated, useRequireAccess } from '../../auth';
import { RaRecord, MutationMode, TransformData } from '../../types';
import { useRedirect, RedirectionSideEffect } from '../../routing';
import { useNotify } from '../../notification';
import {
    useGetOne,
    useUpdate,
    useRefresh,
    UseGetOneHookValue,
    HttpError,
    UseGetOneOptions,
    UseUpdateOptions,
} from '../../dataProvider';
import { useTranslate } from '../../i18n';
import {
    useResourceContext,
    useGetResourceLabel,
    useGetRecordRepresentation,
} from '../../core';
import {
    SaveContextValue,
    SaveHandlerCallbacks,
    useMutationMiddlewares,
} from '../saveContext';

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
    ErrorType = Error,
>(
    props: EditControllerProps<RecordType, ErrorType> = {}
): EditControllerResult<RecordType> => {
    const {
        disableAuthentication = false,
        id: propsId,
        mutationMode = 'undoable',
        mutationOptions = {},
        queryOptions = {},
        redirect: redirectTo = DefaultRedirect,
        transform,
    } = props;
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            'useEditController requires a non-empty resource prop or context'
        );
    }
    const { isPending: isPendingAuthenticated } = useAuthenticated({
        enabled: !disableAuthentication,
    });

    const { isPending: isPendingCanAccess } = useRequireAccess<RecordType>({
        action: 'edit',
        resource,
        // If disableAuthentication is true then isPendingAuthenticated will always be true so this hook is disabled
        enabled: !isPendingAuthenticated,
    });

    const getRecordRepresentation = useGetRecordRepresentation(resource);
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const { id: routeId } = useParams<'id'>();
    if (!routeId && !propsId) {
        throw new Error(
            'useEditController requires an id prop or a route with an /:id? parameter.'
        );
    }
    const id = propsId ?? routeId;
    const { meta: queryMeta, ...otherQueryOptions } = queryOptions;
    const {
        meta: mutationMeta,
        onSuccess,
        onError,
        ...otherMutationOptions
    } = mutationOptions;
    const {
        registerMutationMiddleware,
        getMutateWithMiddlewares,
        unregisterMutationMiddleware,
    } = useMutationMiddlewares();
    const {
        data: record,
        error,
        isLoading,
        isFetching,
        isPending,
        refetch,
    } = useGetOne<RecordType>(
        resource,
        { id, meta: queryMeta },
        {
            enabled:
                (!isPendingAuthenticated && !isPendingCanAccess) ||
                disableAuthentication,
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

    const [update, { isPending: saving }] = useUpdate<RecordType, ErrorType>(
        resource,
        recordCached,
        {
            onSuccess: async (data, variables, context) => {
                if (onSuccess) {
                    return onSuccess(data, variables, context);
                }
                notify(`resources.${resource}.notifications.updated`, {
                    type: 'info',
                    messageArgs: {
                        smart_count: 1,
                        _: translate('ra.notification.updated', {
                            smart_count: 1,
                        }),
                    },
                    undoable: mutationMode === 'undoable',
                });
                redirect(redirectTo, resource, data.id, data);
            },
            onError: (error, variables, context) => {
                if (onError) {
                    return onError(error, variables, context);
                }
                // Don't trigger a notification if this is a validation error
                // (notification will be handled by the useNotifyIsFormInvalid hook)
                const validationErrors = (error as HttpError)?.body?.errors;
                const hasValidationErrors =
                    !!validationErrors &&
                    Object.keys(validationErrors).length > 0;
                if (!hasValidationErrors || mutationMode !== 'pessimistic') {
                    notify(
                        typeof error === 'string'
                            ? error
                            : (error as Error).message ||
                                  'ra.notification.http_error',
                        {
                            type: 'error',
                            messageArgs: {
                                _:
                                    typeof error === 'string'
                                        ? error
                                        : error instanceof Error ||
                                            (typeof error === 'object' &&
                                                error !== null &&
                                                error.hasOwnProperty('message'))
                                          ? // @ts-ignore
                                            error.message
                                          : undefined,
                            },
                        }
                    );
                }
            },
            ...otherMutationOptions,
            mutationMode,
            returnPromise: mutationMode === 'pessimistic',
            getMutateWithMiddlewares,
        }
    );

    const save = useCallback(
        (
            data: Partial<RecordType>,
            {
                onSuccess: onSuccessFromSave,
                onError: onErrorFromSave,
                transform: transformFromSave,
                meta: metaFromSave,
            } = {} as SaveHandlerCallbacks
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
                try {
                    await update(
                        resource,
                        {
                            id,
                            data,
                            meta: metaFromSave ?? mutationMeta,
                        },
                        {
                            onError: onErrorFromSave,
                            onSuccess: onSuccessFromSave,
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
            mutationMeta,
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
        isPending,
        mutationMode,
        record,
        redirect: redirectTo,
        refetch,
        registerMutationMiddleware,
        resource,
        save,
        saving,
        unregisterMutationMiddleware,
    } as EditControllerResult<RecordType>;
};

const DefaultRedirect = 'list';

export interface EditControllerProps<
    RecordType extends RaRecord = any,
    ErrorType = Error,
> {
    disableAuthentication?: boolean;
    id?: RecordType['id'];
    mutationMode?: MutationMode;
    mutationOptions?: UseUpdateOptions<RecordType, ErrorType>;
    queryOptions?: UseGetOneOptions<RecordType>;
    redirect?: RedirectionSideEffect;
    resource?: string;
    transform?: TransformData;
    [key: string]: any;
}

export interface EditControllerBaseResult<RecordType extends RaRecord = any>
    extends SaveContextValue<RecordType> {
    defaultTitle?: string;
    isFetching: boolean;
    isLoading: boolean;
    refetch: UseGetOneHookValue<RecordType>['refetch'];
    redirect: RedirectionSideEffect;
    resource: string;
    saving: boolean;
}

export interface EditControllerLoadingResult<RecordType extends RaRecord = any>
    extends EditControllerBaseResult<RecordType> {
    record: undefined;
    error: null;
    isPending: true;
}
export interface EditControllerLoadingErrorResult<
    RecordType extends RaRecord = any,
    TError = Error,
> extends EditControllerBaseResult<RecordType> {
    record: undefined;
    error: TError;
    isPending: false;
}
export interface EditControllerRefetchErrorResult<
    RecordType extends RaRecord = any,
    TError = Error,
> extends EditControllerBaseResult<RecordType> {
    record: RecordType;
    error: TError;
    isPending: false;
}
export interface EditControllerSuccessResult<RecordType extends RaRecord = any>
    extends EditControllerBaseResult<RecordType> {
    record: RecordType;
    error: null;
    isPending: false;
}

export type EditControllerResult<RecordType extends RaRecord = any> =
    | EditControllerLoadingResult<RecordType>
    | EditControllerLoadingErrorResult<RecordType>
    | EditControllerRefetchErrorResult<RecordType>
    | EditControllerSuccessResult<RecordType>;
