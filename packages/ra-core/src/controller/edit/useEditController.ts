import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { UseQueryOptions, UseMutationOptions } from 'react-query';

import { useAuthenticated } from '../../auth';
import {
    RaRecord,
    MutationMode,
    TransformData,
    UpdateParams,
} from '../../types';
import { useRedirect, RedirectionSideEffect } from '../../sideEffect';
import { useNotify } from '../../notification';
import {
    useGetOne,
    useUpdate,
    useRefresh,
    UseGetOneHookValue,
} from '../../dataProvider';
import { useTranslate } from '../../i18n';
import { useResourceContext, useGetResourceLabel } from '../../core';
import { SaveHandler } from '../saveContext';

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
export const useEditController = <RaRecordType extends RaRecord = any>(
    props: EditControllerProps<RaRecordType> = {}
): EditControllerResult<RaRecordType> => {
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
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const { id: routeId } = useParams<'id'>();
    const id = propsId || decodeURIComponent(routeId);
    const { onSuccess, onError, ...otherMutationOptions } = mutationOptions;

    const { data: record, error, isLoading, isFetching, refetch } = useGetOne<
        RaRecordType
    >(
        resource,
        { id },
        {
            onError: () => {
                notify('ra.notification.item_doesnt_exist', {
                    type: 'warning',
                });
                redirect('list', `/${resource}`);
                refresh();
            },
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: false,
            ...queryOptions,
        }
    );

    // eslint-disable-next-line eqeqeq
    if (record && record.id && record.id != id) {
        throw new Error(
            `useEditController: Fetched record's id attribute (${record.id}) must match the requested 'id' (${id})`
        );
    }

    const getResourceLabel = useGetResourceLabel();
    const defaultTitle = translate('ra.page.edit', {
        name: getResourceLabel(resource, 1),
        id,
        record,
    });

    const [update, { isLoading: saving }] = useUpdate<RaRecordType>(
        resource,
        { id, previousData: record },
        { ...otherMutationOptions, mutationMode }
    );

    const save = useCallback(
        (
            data: Partial<RaRecordType>,
            {
                onSuccess: onSuccessFromSave,
                onError: onErrorFromSave,
                transform: transformFromSave,
            } = {}
        ) =>
            Promise.resolve(
                transformFromSave
                    ? transformFromSave(data)
                    : transform
                    ? transform(data)
                    : data
            ).then((data: Partial<RaRecordType>) =>
                update(
                    resource,
                    { data },
                    {
                        onSuccess: onSuccessFromSave
                            ? onSuccessFromSave
                            : onSuccess
                            ? onSuccess
                            : () => {
                                  notify('ra.notification.updated', {
                                      type: 'info',
                                      messageArgs: { smart_count: 1 },
                                      undoable: mutationMode === 'undoable',
                                  });
                                  redirect(
                                      redirectTo,
                                      `/${resource}`,
                                      data.id,
                                      data
                                  );
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
                                          type: 'warning',
                                          messageArgs: {
                                              _:
                                                  typeof error === 'string'
                                                      ? error
                                                      : error && error.message
                                                      ? error.message
                                                      : undefined,
                                          },
                                      }
                                  );
                              },
                    }
                )
            ),
        [
            mutationMode,
            notify,
            onError,
            onSuccess,
            redirect,
            redirectTo,
            resource,
            transform,
            update,
        ]
    );

    return {
        defaultTitle,
        error,
        isFetching,
        isLoading,
        record,
        redirect: DefaultRedirect,
        refetch,
        resource,
        save,
        saving,
    };
};

export interface EditControllerProps<RaRecordType extends RaRecord = any> {
    disableAuthentication?: boolean;
    id?: RaRecordType['id'];
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<
        RaRecordType,
        unknown,
        UpdateParams<RaRecordType>
    >;
    queryOptions?: UseQueryOptions<RaRecordType>;
    redirect?: RedirectionSideEffect;
    resource?: string;
    transform?: TransformData;
    [key: string]: any;
}

export interface EditControllerResult<RaRecordType extends RaRecord = any> {
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data?: RaRecordType;
    error?: any;
    defaultTitle: string;
    isFetching: boolean;
    isLoading: boolean;
    save: SaveHandler;
    saving: boolean;
    record?: RaRecordType;
    refetch: UseGetOneHookValue<RaRecordType>['refetch'];
    redirect: RedirectionSideEffect;
    resource: string;
}

const DefaultRedirect = 'list';
