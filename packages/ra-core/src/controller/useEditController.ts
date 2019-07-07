import { useEffect, useCallback } from 'react';
// @ts-ignore
import { useDispatch } from 'react-redux';
import { reset as resetForm } from 'redux-form';
import inflection from 'inflection';

import useVersion from './useVersion';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import { crudUpdate, startUndoable } from '../actions';
import { REDUX_FORM_NAME } from '../form';
import { Record, Identifier } from '../types';
import { RedirectionSideEffect } from '../sideEffect';
import useGetOne from '../fetch/useGetOne';
import { useTranslate } from '../i18n';

export interface EditProps {
    basePath: string;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    hasList?: boolean;
    id: Identifier;
    isLoading: boolean;
    resource: string;
    undoable?: boolean;
    record?: Record;
}

export interface EditControllerProps {
    isLoading: boolean;
    defaultTitle: string;
    save: (data: Record, redirect: RedirectionSideEffect) => void;
    resource: string;
    basePath: string;
    record?: Record;
    redirect: RedirectionSideEffect;
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
    const { basePath, id, resource, undoable } = props;
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

    const save = useCallback(
        (data: Partial<Record>, redirect: RedirectionSideEffect) => {
            const updateAction = crudUpdate(
                resource,
                id,
                data,
                record,
                basePath,
                redirect
            );

            if (undoable) {
                dispatch(startUndoable(updateAction));
            } else {
                dispatch(updateAction);
            }
        },
        [resource, id, record, basePath, undoable] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return {
        isLoading: loading,
        defaultTitle,
        save,
        resource,
        basePath,
        record,
        redirect: getDefaultRedirectRoute(),
        version,
    };
};

const getDefaultRedirectRoute = () => 'list';

export default useEditController;
