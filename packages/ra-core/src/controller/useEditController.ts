import { useCallback } from 'react';
import inflection from 'inflection';

import useVersion from './useVersion';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import { Record, Identifier } from '../types';
import {
    useNotify,
    useRedirect,
    useRefresh,
    RedirectionSideEffect,
} from '../sideEffect';
import {
    OnSuccess,
    SetOnSuccess,
    OnFailure,
    SetOnFailure,
    TransformData,
    SetTransformData,
    useSaveModifiers,
} from './saveModifiers';
import { useGetOne, useUpdate } from '../dataProvider';
import { useTranslate } from '../i18n';
import { CRUD_GET_ONE, CRUD_UPDATE } from '../actions';

export interface EditProps {
    basePath: string;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    hasList?: boolean;
    id: Identifier;
    resource: string;
    undoable?: boolean;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    transform?: TransformData;
    [key: string]: any;
}

export interface EditControllerProps {
    loading: boolean;
    loaded: boolean;
    saving: boolean;
    defaultTitle: string;
    save: (
        data: Record,
        redirect?: RedirectionSideEffect,
        callbacks?: {
            onSuccess?: OnSuccess;
            onFailure?: OnFailure;
            transform?: TransformData;
        }
    ) => void;
    setOnSuccess: SetOnSuccess;
    setOnFailure: SetOnFailure;
    setTransform: SetTransformData;
    resource: string;
    basePath: string;
    record?: Record;
    redirect: RedirectionSideEffect;
    version: number;
    successMessage?: string;
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
const useEditController = (props: EditProps): EditControllerProps => {
    useCheckMinimumRequiredProps('Edit', ['basePath', 'resource'], props);
    const {
        basePath,
        id,
        resource,
        successMessage,
        undoable = true,
        onSuccess,
        onFailure,
        transform,
    } = props;
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

    const { data: record, loading, loaded } = useGetOne(resource, id, {
        action: CRUD_GET_ONE,
        onFailure: () => {
            notify('ra.notification.item_doesnt_exist', 'warning');
            redirect('list', basePath);
            refresh();
        },
    });

    const resourceName = translate(`resources.${resource}.name`, {
        smart_count: 1,
        _: inflection.humanize(inflection.singularize(resource)),
    });
    const defaultTitle = translate('ra.page.edit', {
        name: `${resourceName}`,
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
        ) => {
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
                                      undoable
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
                                      'warning'
                                  );
                                  if (undoable) {
                                      refresh();
                                  }
                              },
                        undoable,
                    }
                )
            );
        },
        [
            transformRef,
            update,
            onSuccessRef,
            onFailureRef,
            undoable,
            notify,
            successMessage,
            redirect,
            basePath,
            refresh,
        ]
    );

    return {
        loading,
        loaded,
        saving,
        defaultTitle,
        save,
        setOnSuccess,
        setOnFailure,
        setTransform,
        resource,
        basePath,
        record,
        redirect: DefaultRedirect,
        version,
    };
};

export default useEditController;

const DefaultRedirect = 'list';
