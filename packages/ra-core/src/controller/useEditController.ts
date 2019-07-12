import { useEffect, useCallback } from 'react';
// @ts-ignore
import { useDispatch } from 'react-redux';
import { reset as resetForm } from 'redux-form';
import inflection from 'inflection';

import useVersion from './useVersion';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import { REDUX_FORM_NAME } from '../form';
import { Record, Identifier } from '../types';
import { RedirectionSideEffect } from '../sideEffect';
import { useGetOne, useUpdate } from '../fetch';
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
    const dispatch = useDispatch();
    const version = useVersion();
    const { data: record, loading } = useGetOne(resource, id, {
        basePath,
        version, // used to force reload
        onFailure: {
            notification: {
                body: 'ra.notification.item_doesnt_exist',
                level: 'warning',
            },
            redirectTo: 'list',
            refresh: true,
        },
    });

    useEffect(() => {
        dispatch(resetForm(REDUX_FORM_NAME));
    }, [resource, id, version]); // eslint-disable-line react-hooks/exhaustive-deps

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
        record,
        {
            onSuccess: {
                notification: {
                    body: 'ra.notification.updated',
                    level: 'info',
                    messageArgs: {
                        smart_count: 1,
                    },
                },
                basePath,
            },
            onFailure: {
                notification: {
                    body: 'ra.notification.http_error',
                    level: 'warning',
                },
            },
            undoable,
        }
    );

    const save = useCallback(
        (data: Partial<Record>, redirectTo = 'list') =>
            update(null, { data }, { onSuccess: { redirectTo } }),
        [update]
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
