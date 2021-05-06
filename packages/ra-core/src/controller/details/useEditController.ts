import { useCallback, MutableRefObject } from 'react';

import useVersion from '../useVersion';
import { useCheckMinimumRequiredProps } from '../checkMinimumRequiredProps';
import {
    Record,
    Identifier,
    MutationMode,
    OnSuccess,
    OnFailure,
} from '../../types';
import {
    useNotify,
    useRedirect,
    useRefresh,
    RedirectionSideEffect,
} from '../../sideEffect';
import { useGetOne, useUpdate, Refetch } from '../../dataProvider';
import { useTranslate } from '../../i18n';
import { CRUD_GET_ONE, CRUD_UPDATE } from '../../actions';
import {
    SetOnSuccess,
    SetOnFailure,
    TransformData,
    SetTransformData,
    useSaveModifiers,
} from '../saveModifiers';
import { useResourceContext, useGetResourceLabel } from '../../core';

export interface EditProps {
    basePath?: string;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    hasList?: boolean;
    id?: Identifier;
    resource?: string;
    /** @deprecated use mutationMode: undoable instead */
    undoable?: boolean;
    mutationMode?: MutationMode;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    transform?: TransformData;
    [key: string]: any;
}

export interface EditControllerProps<RecordType extends Record = Record> {
    basePath?: string;
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data?: RecordType;
    defaultTitle: string;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    hasList?: boolean;
    loading: boolean;
    loaded: boolean;
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
    successMessage?: string;
    record?: RecordType;
    refetch: Refetch;
    redirect: RedirectionSideEffect;
    resource: string;
    version: number;
}

/**
 * Prepare data for the Edit view
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
 * const MyEdit = props => {
 *     const controllerProps = useEditController(props);
 *     return <EditView {...controllerProps} {...props} />;
 * }
 */
export const useEditController = <RecordType extends Record = Record>(
    props: EditProps
): EditControllerProps<RecordType> => {
    useCheckMinimumRequiredProps('Edit', ['basePath', 'resource'], props);
    const {
        basePath,
        hasCreate,
        hasEdit,
        hasList,
        hasShow,
        id,
        successMessage,
        // @deprecated use mutationMode: undoable instead
        undoable = true,
        onSuccess,
        onFailure,
        mutationMode = undoable ? 'undoable' : undefined,
        transform,
    } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const version = useVersion();

    if (process.env.NODE_ENV !== 'production' && successMessage) {
        console.log(
            '<Edit successMessage> prop is deprecated, use the onSuccess prop instead.'
        );
    }

    const {
        onSuccessRef,
        setOnSuccess,
        onFailureRef,
        setOnFailure,
        transformRef,
        setTransform,
    } = useSaveModifiers({ onSuccess, onFailure, transform });

    const { data: record, loading, loaded, refetch } = useGetOne<RecordType>(
        resource,
        id,
        {
            action: CRUD_GET_ONE,
            onFailure: () => {
                notify('ra.notification.item_doesnt_exist', 'warning');
                redirect('list', basePath);
                refresh();
            },
        }
    );

    const getResourceLabel = useGetResourceLabel();
    const defaultTitle = translate('ra.page.edit', {
        name: getResourceLabel(resource, 1),
        id,
        record,
    });

    const [update, { loading: saving }] = useUpdate(
        resource,
        id,
        {}, // set by the caller
        record
    );

    const save = useCallback(
        (
            data: Partial<Record>,
            redirectTo = DefaultRedirect,
            {
                onSuccess: onSuccessFromSave,
                onFailure: onFailureFromSave,
                transform: transformFromSave,
            } = {}
        ) =>
            Promise.resolve(
                transformFromSave
                    ? transformFromSave(data)
                    : transformRef.current
                    ? transformRef.current(data)
                    : data
            ).then(data =>
                update(
                    { payload: { data } },
                    {
                        action: CRUD_UPDATE,
                        onSuccess: onSuccessFromSave
                            ? onSuccessFromSave
                            : onSuccessRef.current
                            ? onSuccessRef.current
                            : () => {
                                  notify(
                                      successMessage ||
                                          'ra.notification.updated',
                                      'info',
                                      {
                                          smart_count: 1,
                                      },
                                      mutationMode === 'undoable'
                                  );
                                  redirect(redirectTo, basePath, data.id, data);
                              },
                        onFailure: onFailureFromSave
                            ? onFailureFromSave
                            : onFailureRef.current
                            ? onFailureRef.current
                            : error => {
                                  notify(
                                      typeof error === 'string'
                                          ? error
                                          : error.message ||
                                                'ra.notification.http_error',
                                      'warning',
                                      {
                                          _:
                                              typeof error === 'string'
                                                  ? error
                                                  : error && error.message
                                                  ? error.message
                                                  : undefined,
                                      }
                                  );
                                  if (
                                      mutationMode === 'undoable' ||
                                      mutationMode === 'pessimistic'
                                  ) {
                                      refresh();
                                  }
                              },
                        mutationMode,
                    }
                )
            ),
        [
            transformRef,
            update,
            onSuccessRef,
            onFailureRef,
            notify,
            successMessage,
            redirect,
            basePath,
            refresh,
            mutationMode,
        ]
    );

    return {
        loading,
        loaded,
        saving,
        defaultTitle,
        hasCreate,
        hasEdit,
        hasList,
        hasShow,
        onSuccessRef,
        onFailureRef,
        transformRef,
        save,
        setOnSuccess,
        setOnFailure,
        setTransform,
        refetch,
        resource,
        basePath,
        record,
        redirect: DefaultRedirect,
        version,
    };
};

const DefaultRedirect = 'list';
