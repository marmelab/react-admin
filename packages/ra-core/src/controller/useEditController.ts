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
            onSuccess: () => void;
            onFailure: (error: string | { message?: string }) => void;
        }
    ) => void;
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
    const { basePath, id, resource, successMessage, undoable = true } = props;
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const version = useVersion();
    const { data: record, loading, loaded } = useGetOne(resource, id, {
        version, // used to force reload
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
            { onSuccess, onFailure } = {}
        ) =>
            update(
                { payload: { data } },
                {
                    action: CRUD_UPDATE,
                    onSuccess: onSuccess
                        ? onSuccess
                        : () => {
                              notify(
                                  successMessage || 'ra.notification.updated',
                                  'info',
                                  {
                                      smart_count: 1,
                                  },
                                  undoable
                              );
                              redirect(redirectTo, basePath, data.id, data);
                          },
                    onFailure: onFailure
                        ? onFailure
                        : error =>
                              notify(
                                  typeof error === 'string'
                                      ? error
                                      : error.message ||
                                            'ra.notification.http_error',
                                  'warning'
                              ),
                    undoable,
                }
            ),
        [basePath, notify, redirect, undoable, update, successMessage]
    );

    return {
        loading,
        loaded,
        saving,
        defaultTitle,
        save,
        resource,
        basePath,
        record,
        redirect: DefaultRedirect,
        version,
    };
};

export default useEditController;

const DefaultRedirect = 'list';
