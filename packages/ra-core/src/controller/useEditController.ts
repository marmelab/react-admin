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
    isLoading: boolean;
    isSaving: boolean;
    defaultTitle: string;
    save: (data: Record, redirect?: RedirectionSideEffect) => void;
    resource: string;
    basePath: string;
    record?: Record;
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
const useEditController = (props: EditProps): EditControllerProps => {
    useCheckMinimumRequiredProps('Edit', ['basePath', 'resource'], props);
    const { basePath, id, resource, undoable = true } = props;
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const version = useVersion();
    const { data: record, loading } = useGetOne(resource, id, {
        version, // used to force reload
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

    const [update, { loading: isSaving }] = useUpdate(
        resource,
        id,
        {}, // set by the caller
        record
    );

    const save = useCallback(
        (data: Partial<Record>, redirectTo = 'list') =>
            update(
                null,
                { data },
                {
                    onSuccess: () => {
                        notify(
                            'ra.notification.updated',
                            'info',
                            {
                                smart_count: 1,
                            },
                            undoable
                        );
                        redirect(redirectTo, basePath, data.id, data);
                    },
                    onFailure: error =>
                        notify(
                            typeof error === 'string'
                                ? error
                                : error.message || 'ra.notification.http_error',
                            'warning'
                        ),
                    undoable,
                }
            ),
        [basePath, notify, redirect, undoable, update]
    );

    return {
        isLoading: loading,
        isSaving,
        defaultTitle,
        save,
        resource,
        basePath,
        record,
        version,
    };
};

export default useEditController;
