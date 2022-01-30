import * as React from 'react';
import { Children, cloneElement, isValidElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
    ComponentPropType,
    defaultExporter,
    ListControllerProps,
    useListContext,
    getListControllerProps,
    useVersion,
} from 'ra-core';

import Title, { TitlePropType } from '../layout/Title';
import ListToolbar from './ListToolbar';
import DefaultPagination from './pagination/Pagination';
import BulkDeleteButton from '../button/BulkDeleteButton';
import BulkActionsToolbar from './BulkActionsToolbar';
import DefaultActions from './ListActions';
import { Empty } from './Empty';
import { ListProps } from '../types';

export const ListView = (props: ListViewProps) => {
    const {
        actions,
        aside,
        filters,
        bulkActionButtons,
        pagination,
        children,
        className,
        classes: classesOverride,
        component: Content,
        exporter = defaultExporter,
        title,
        empty,
        ...rest
    } = props;
    const controllerProps = getListControllerProps(props); // deprecated, to be removed in v4
    const listContext = useListContext(props);
    const classes = useStyles(props);
    const {
        defaultTitle,
        total,
        loaded,
        loading,
        filterValues,
        selectedIds,
    } = listContext;
    const version = useVersion();

    const renderList = () => (
        <>
            {(filters || actions) && (
                <ListToolbar
                    filters={filters}
                    {...controllerProps} // deprecated, use ListContext instead, to be removed in v4
                    actions={actions}
                    exporter={exporter} // deprecated, use ListContext instead, to be removed in v4
                />
            )}
            <div className={classes.main}>
                <Content
                    className={classnames(classes.content, {
                        [classes.bulkActionsDisplayed]: selectedIds.length > 0,
                    })}
                    key={version}
                >
                    {bulkActionButtons !== false ? (
                        <BulkActionsToolbar {...controllerProps}>
                            {isValidElement(bulkActionButtons) ? (
                                bulkActionButtons
                            ) : (
                                <DefaultBulkActionButtons />
                            )}
                        </BulkActionsToolbar>
                    ) : null}
                    {children &&
                        // @ts-ignore-line
                        cloneElement(Children.only(children), {
                            ...controllerProps, // deprecated, use ListContext instead, to be removed in v4
                            hasBulkActions: bulkActionButtons !== false,
                        })}
                    {pagination && cloneElement(pagination, listContext)}
                </Content>
                {aside && cloneElement(aside, listContext)}
            </div>
        </>
    );

    const shouldRenderEmptyPage =
        loaded && !loading && total === 0 && !Object.keys(filterValues).length;

    return (
        <div
            className={classnames('list-page', classes.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <Title title={title} defaultTitle={defaultTitle} />
            {shouldRenderEmptyPage && empty !== false
                ? cloneElement(empty, listContext)
                : renderList()}
        </div>
    );
};

ListView.propTypes = {
    // @ts-ignore-line
    actions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    aside: PropTypes.element,
    basePath: PropTypes.string,
    // @ts-ignore-line
    bulkActionButtons: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    children: PropTypes.element,
    className: PropTypes.string,
    classes: PropTypes.object,
    component: ComponentPropType,
    // @ts-ignore-line
    currentSort: PropTypes.shape({
        field: PropTypes.string.isRequired,
        order: PropTypes.string.isRequired,
    }),
    data: PropTypes.any,
    defaultTitle: PropTypes.string,
    displayedFilters: PropTypes.object,
    // @ts-ignore-line
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filterDefaultValues: PropTypes.object,
    filters: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]),
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    hideFilter: PropTypes.func,
    ids: PropTypes.array,
    loading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    onUnselectItems: PropTypes.func,
    page: PropTypes.number,
    // @ts-ignore-line
    pagination: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    perPage: PropTypes.number,
    refresh: PropTypes.func,
    resource: PropTypes.string,
    selectedIds: PropTypes.array,
    setFilters: PropTypes.func,
    setPage: PropTypes.func,
    setPerPage: PropTypes.func,
    setSort: PropTypes.func,
    showFilter: PropTypes.func,
    title: TitlePropType,
    total: PropTypes.number,
    version: PropTypes.number,
};

const DefaultBulkActionButtons = props => <BulkDeleteButton {...props} />;

ListView.defaultProps = {
    actions: <DefaultActions />,
    classes: {},
    component: Card,
    bulkActionButtons: <DefaultBulkActionButtons />,
    pagination: <DefaultPagination />,
    empty: <Empty />,
};

const useStyles = makeStyles(
    theme => ({
        root: {},
        main: {
            display: 'flex',
        },
        content: {
            marginTop: 0,
            transition: theme.transitions.create('margin-top'),
            position: 'relative',
            flex: '1 1 auto',
            [theme.breakpoints.down('xs')]: {
                boxShadow: 'none',
            },
            overflow: 'inherit',
        },
        bulkActionsDisplayed: {
            marginTop: -theme.spacing(8),
            transition: theme.transitions.create('margin-top'),
        },
        actions: {
            zIndex: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
        },
        noResults: { padding: 20 },
    }),
    { name: 'RaList' }
);

export interface ListViewProps
    extends Omit<ListProps, 'basePath' | 'hasCreate' | 'perPage' | 'resource'>,
        // Partial because we now get those props via context
        Partial<ListControllerProps> {
    children: ReactElement;
}

const sanitizeRestProps: (
    props: Omit<
        ListViewProps,
        | 'actions'
        | 'aside'
        | 'filter'
        | 'filters'
        | 'bulkActionButtons'
        | 'pagination'
        | 'children'
        | 'className'
        | 'classes'
        | 'component'
        | 'exporter'
        | 'title'
        | 'empty'
    >
) => any = ({
    basePath = null,
    currentSort = null,
    data = null,
    defaultTitle = null,
    displayedFilters = null,
    filterDefaultValues = null,
    filterValues = null,
    hasCreate = null,
    hasEdit = null,
    hasList = null,
    hasShow = null,
    hideFilter = null,
    history = null,
    ids = null,
    loading = null,
    loaded = null,
    location = null,
    match = null,
    onSelect = null,
    onToggleItem = null,
    onUnselectItems = null,
    options = null,
    page = null,
    permissions = null,
    perPage = null,
    refetch = null,
    resource = null,
    selectedIds = null,
    setFilters = null,
    setPage = null,
    setPerPage = null,
    setSort = null,
    showFilter = null,
    syncWithLocation = null,
    sort = null,
    total = null,
    ...rest
}) => rest;

export default ListView;
