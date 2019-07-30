import { useCallback } from 'react';
// @ts-ignore
import inflection from 'inflection';
import { parse } from 'query-string';

import { useCreate } from '../dataProvider';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import { Location } from 'history';
import { match as Match } from 'react-router';
import { Record } from '../types';
import { useNotify, useRedirect, RedirectionSideEffect } from '../sideEffect';

import { useTranslate } from '../i18n';

export interface CreateControllerProps {
    isLoading: boolean;
    isSaving: boolean;
    defaultTitle: string;
    save: (record: Partial<Record>, redirect: RedirectionSideEffect) => void;
    resource: string;
    basePath: string;
    record?: Partial<Record>;
    redirect: RedirectionSideEffect;
}

export interface CreateProps {
    basePath: string;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
    location: Location;
    match: Match;
    record?: Partial<Record>;
    resource: string;
}

/**
 * Prepare data for the Create view
 *
 * @param {Object} props The props passed to the Create component.
 *
 * @return {Object} controllerProps Fetched data and callbacks for the Create view
 *
 * @example
 *
 * import { useCreateController } from 'react-admin';
 * import CreateView from './CreateView';
 *
 * const MyCreate = props => {
 *     const controllerProps = useCreateController(props);
 *     return <CreateView {...controllerProps} {...props} />;
 * }
 */
const useCreateController = (props: CreateProps): CreateControllerProps => {
    useCheckMinimumRequiredProps(
        'Create',
        ['basePath', 'location', 'resource'],
        props
    );
    const {
        basePath,
        resource,
        location,
        record = {},
        hasShow,
        hasEdit,
    } = props;

    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const recordToUse = getRecord(location, record);

    const [create, { loading: isSaving }] = useCreate(resource);

    const save = useCallback(
        (data: Partial<Record>, redirectTo = 'list') =>
            create(
                null,
                { data },
                {
                    onSuccess: ({ data: newRecord }) => {
                        notify('ra.notification.created', 'info', {
                            smart_count: 1,
                        });
                        redirect(redirectTo, basePath, newRecord.id, newRecord);
                    },
                    onFailure: error =>
                        notify(
                            typeof error === 'string'
                                ? error
                                : error.message || 'ra.notification.http_error',
                            'warning'
                        ),
                }
            ),
        [basePath, create, notify, redirect]
    );

    const resourceName = translate(`resources.${resource}.name`, {
        smart_count: 1,
        _: inflection.humanize(inflection.singularize(resource)),
    });
    const defaultTitle = translate('ra.page.create', {
        name: `${resourceName}`,
    });

    return {
        isLoading: false,
        isSaving,
        defaultTitle,
        save,
        resource,
        basePath,
        record: recordToUse,
        redirect: getDefaultRedirectRoute(hasShow, hasEdit),
    };
};

export default useCreateController;

export const getRecord = ({ state, search }, record: any = {}) =>
    state && state.record
        ? state.record
        : search
        ? parse(search, { arrayFormat: 'bracket' })
        : record;

const getDefaultRedirectRoute = (hasShow, hasEdit) => {
    if (hasEdit) {
        return 'edit';
    }
    if (hasShow) {
        return 'show';
    }
    return 'list';
};
