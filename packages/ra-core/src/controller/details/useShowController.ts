import useVersion from '../useVersion';
import { useCheckMinimumRequiredProps } from '../checkMinimumRequiredProps';
import { Record, Identifier } from '../../types';
import { useGetOne, Refetch } from '../../dataProvider';
import { useTranslate } from '../../i18n';
import { useNotify, useRedirect, useRefresh } from '../../sideEffect';
import { CRUD_GET_ONE } from '../../actions';
import { useResourceContext, useGetResourceLabel } from '../../core';

export interface ShowProps {
    basePath?: string;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    hasList?: boolean;
    id?: Identifier;
    resource?: string;
    [key: string]: any;
}

export interface ShowControllerProps<RecordType extends Record = Record> {
    basePath?: string;
    defaultTitle: string;
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data?: RecordType;
    loading: boolean;
    loaded: boolean;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
    resource: string;
    record?: RecordType;
    refetch: Refetch;
    version: number;
}

/**
 * Prepare data for the Show view
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
 * const MyShow = props => {
 *     const controllerProps = useShowController(props);
 *     return <ShowView {...controllerProps} {...props} />;
 * }
 */
export const useShowController = <RecordType extends Record = Record>(
    props: ShowProps
): ShowControllerProps<RecordType> => {
    useCheckMinimumRequiredProps('Show', ['basePath', 'resource'], props);
    const { basePath, hasCreate, hasEdit, hasList, hasShow, id } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const version = useVersion();
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
    const defaultTitle = translate('ra.page.show', {
        name: getResourceLabel(resource, 1),
        id,
        record,
    });

    return {
        loading,
        loaded,
        defaultTitle,
        resource,
        basePath,
        record,
        refetch,
        hasCreate,
        hasEdit,
        hasList,
        hasShow,
        version,
    };
};
