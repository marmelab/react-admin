import { useCallback, MutableRefObject } from 'react';
import { useParams } from 'react-router-dom';
import { UseQueryOptions, UseMutationOptions } from 'react-query';

import useVersion from '../useVersion';
import {
    Record,
    Identifier,
    MutationMode,
    OnSuccess,
    OnFailure,
    UpdateResult,
    UpdateParams,
} from '../../types';
import {
    useNotify,
    useRedirect,
    useRefresh,
    RedirectionSideEffect,
} from '../../sideEffect';
import { useGetOne, useUpdate, Refetch } from '../../dataProvider';
import { useTranslate } from '../../i18n';
import { useResourceContext, useGetResourceLabel } from '../../core';
import {
    SetOnSuccess,
    SetOnFailure,
    TransformData,
    SetTransformData,
    useSaveModifiers,
} from '../saveModifiers';

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
export const useEditController = <RecordType extends Record = Record>(
    props: EditControllerProps<RecordType> = {}
): EditControllerResult<RecordType> => {
    const {
        id: propsId,
        onSuccess,
        onFailure,
        mutationMode = 'undoable',
        transform,
        queryOptions = {},
        mutationOptions = {},
    } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const version = useVersion();
    const { id: routeId } = useParams<{ id?: string }>();
    const id = propsId || decodeURIComponent(routeId);

    const {
        onSuccessRef,
        setOnSuccess,
        onFailureRef,
        setOnFailure,
        transformRef,
        setTransform,
    } = useSaveModifiers({ onSuccess, onFailure, transform });

    const { data: record, error, isLoading, isFetching, refetch } = useGetOne<
        RecordType
    >(resource, id, {
        onError: () => {
            notify('ra.notification.item_doesnt_exist', {
                type: 'warning',
            });
            redirect('list', `/${resource}`);
            refresh();
        },
        retry: false,
        ...queryOptions,
    });

    const getResourceLabel = useGetResourceLabel();
    const defaultTitle = translate('ra.page.edit', {
        name: getResourceLabel(resource, 1),
        id,
        record,
    });

    const { mutate, isLoading: saving } = useUpdate<RecordType>(
        { resource, id, previousData: record },
        { ...mutationOptions, mutationMode }
    );

    const save = useCallback(
        (
            data: Partial<RecordType>,
            redirectTo = DefaultRedirect,
            {
                onSuccess: onSuccessFromSave,
                onFailure: onFailureFromSave,
                transform: transformFromSave,
            } = {}
        ) => {
            return Promise.resolve(
                transformFromSave
                    ? transformFromSave(data)
                    : transformRef.current
                    ? transformRef.current(data)
                    : data
            ).then((data: Partial<RecordType>) =>
                mutate(
                    { data },
                    {
                        onSuccess: onSuccessFromSave
                            ? onSuccessFromSave
                            : onSuccessRef.current
                            ? onSuccessRef.current
                            : () => {
                                  notify('ra.notification.updated', {
                                      type: 'info',
                                      messageArgs: {
                                          smart_count: 1,
                                      },
                                      undoable: mutationMode === 'undoable',
                                  });
                                  redirect(
                                      redirectTo,
                                      `/${resource}`,
                                      data.id,
                                      data
                                  );
                              },
                        onError: onFailureFromSave
                            ? onFailureFromSave
                            : onFailureRef.current
                            ? onFailureRef.current
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
            );
        },
        [
            transformRef,
            mutate,
            onSuccessRef,
            onFailureRef,
            notify,
            redirect,
            refresh,
            resource,
            id,
            record,
            mutationMode,
        ]
    );

    return {
        defaultTitle,
        error,
        isFetching,
        isLoading,
        onFailureRef,
        onSuccessRef,
        record,
        redirect: DefaultRedirect,
        refetch,
        resource,
        save,
        saving,
        setOnFailure,
        setOnSuccess,
        setTransform,
        transformRef,
        version,
    };
};

export interface EditControllerProps<RecordType extends Record = Record> {
    id?: Identifier;
    resource?: string;
    mutationMode?: MutationMode;
    queryOptions?: UseQueryOptions<RecordType>;
    mutationOptions?: UseMutationOptions<
        UpdateResult<RecordType>,
        unknown,
        UpdateParams<RecordType>
    >;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    transform?: TransformData;
    [key: string]: any;
}

export interface EditControllerResult<RecordType extends Record = Record> {
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data?: RecordType;
    error?: any;
    defaultTitle: string;
    isFetching: boolean;
    isLoading: boolean;
    onSuccessRef: MutableRefObject<OnSuccess>;
    onFailureRef: MutableRefObject<OnFailure>;
    transformRef: MutableRefObject<TransformData>;
    save: (
        data: Partial<Record>,
        redirect?: RedirectionSideEffect,
        callbacks?: {
            onSuccess?: OnSuccess;
            onFailure?: OnFailure;
            transform?: TransformData;
        }
    ) => void;
    saving: boolean;
    setOnSuccess: SetOnSuccess;
    setOnFailure: SetOnFailure;
    setTransform: SetTransformData;
    record?: RecordType;
    refetch: Refetch;
    redirect: RedirectionSideEffect;
    resource: string;
    version: number;
}

const DefaultRedirect = 'list';
