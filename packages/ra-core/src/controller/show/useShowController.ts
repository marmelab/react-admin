import { useParams } from 'react-router-dom';
import { UseQueryOptions } from 'react-query';

import { useAuthenticated } from '../../auth';
import { RaRecord } from '../../types';
import { useGetOne, useRefresh, UseGetOneHookValue } from '../../dataProvider';
import { useTranslate } from '../../i18n';
import { useRedirect } from '../../routing';
import { useNotify } from '../../notification';
import {
    useResourceContext,
    useGetResourceLabel,
    useGetRecordRepresentation,
} from '../../core';

/**
 * Prepare data for the Show view.
 *
 * useShowController does a few things:
 * - it grabs the id from the URL and the resource name from the ResourceContext,
 * - it fetches the record via useGetOne,
 * - it prepares the page title.
 *
 * @param {Object} props The props passed to the Show component.
 *
 * @return {Object} controllerProps Fetched data and callbacks for the Show view
 *
 * @example
 *
 * import { useShowController } from 'react-admin';
 * import ShowView from './ShowView';
 *
 * const MyShow = () => {
 *     const controllerProps = useShowController();
 *     return <ShowView {...controllerProps} />;
 * };
 *
 * @example // useShowController can also take its parameters from props
 *
 * import { useShowController } from 'react-admin';
 * import ShowView from './ShowView';
 *
 * const MyShow = () => {
 *     const controllerProps = useShowController({ resource: 'posts', id: 1234 });
 *     return <ShowView {...controllerProps} />;
 * };
 */
export const useShowController = <RecordType extends RaRecord = any>(
    props: ShowControllerProps<RecordType> = {}
): ShowControllerResult<RecordType> => {
    const { disableAuthentication, id: propsId, queryOptions = {} } = props;
    useAuthenticated({ enabled: !disableAuthentication });
    const resource = useResourceContext(props);
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const { id: routeId } = useParams<'id'>();
    const id = propsId != null ? propsId : decodeURIComponent(routeId);
    const { meta, ...otherQueryOptions } = queryOptions;

    const { data: record, error, isLoading, isFetching, refetch } = useGetOne<
        RecordType
    >(
        resource,
        { id, meta },
        {
            onError: () => {
                notify('ra.notification.item_doesnt_exist', {
                    type: 'error',
                });
                redirect('list', resource);
                refresh();
            },
            retry: false,
            ...otherQueryOptions,
        }
    );

    // eslint-disable-next-line eqeqeq
    if (record && record.id && record.id != id) {
        throw new Error(
            `useShowController: Fetched record's id attribute (${record.id}) must match the requested 'id' (${id})`
        );
    }

    const getResourceLabel = useGetResourceLabel();
    const recordRepresentation = getRecordRepresentation(record);
    const defaultTitle = translate('ra.page.show', {
        name: getResourceLabel(resource, 1),
        id,
        record,
        recordRepresentation:
            typeof recordRepresentation === 'string'
                ? recordRepresentation
                : '',
    });

    return {
        defaultTitle,
        error,
        isLoading,
        isFetching,
        record,
        refetch,
        resource,
    };
};

export interface ShowControllerProps<RecordType extends RaRecord = any> {
    disableAuthentication?: boolean;
    id?: RecordType['id'];
    queryOptions?: UseQueryOptions<RecordType> & { meta?: any };
    resource?: string;
}

export interface ShowControllerResult<RecordType extends RaRecord = any> {
    defaultTitle: string;
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data?: RecordType;
    error?: any;
    isFetching: boolean;
    isLoading: boolean;
    resource: string;
    record?: RecordType;
    refetch: UseGetOneHookValue<RecordType>['refetch'];
}
