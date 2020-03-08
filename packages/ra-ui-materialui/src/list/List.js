import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
    useCheckMinimumRequiredProps,
    useListController,
    getListControllerProps,
    ComponentPropType,
    ExporterContext,
    defaultExporter,
} from 'ra-core';

import Title, { TitlePropType } from '../layout/Title';
import ListToolbar from './ListToolbar';
import DefaultPagination from './Pagination';
import BulkDeleteButton from '../button/BulkDeleteButton';
import BulkActionsToolbar from './BulkActionsToolbar';
import DefaultActions from './ListActions';
import Empty from './Empty';

/**
 * List page component
 *
 * The <List> component renders the list layout (title, buttons, filters, pagination),
 * and fetches the list of records from the REST API.
 * It then delegates the rendering of the list of records to its child component.
 * Usually, it's a <Datagrid>, responsible for displaying a table with one row for each post.
 *
 * In Redux terms, <List> is a connected component, and <Datagrid> is a dumb component.
 *
 * The <List> component accepts the following props:
 *
 * - actions
 * - aside
 * - component
 * - filter (the permanent filter to apply to the query)
 * - filters (a React component used to display the filter form)
 * - pagination
 * - perPage
 * - sort
 * - title
 *
 * @example
 *
 * const PostFilter = (props) => (
 *     <Filter {...props}>
 *         <TextInput label="Search" source="q" alwaysOn />
 *         <TextInput label="Title" source="title" />
 *     </Filter>
 * );
 * export const PostList = (props) => (
 *     <List {...props}
 *         title="List of posts"
 *         sort={{ field: 'published_at' }}
 *         filter={{ is_published: true }}
 *         filters={PostFilter}
 *     >
 *         <Datagrid>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <EditButton />
 *         </Datagrid>
 *     </List>
 * );
 */
const List = props => <ListView {...props} {...useListController(props)} />;

List.propTypes = {
    // the props you can change
    actions: PropTypes.element,
    aside: PropTypes.element,
    bulkActionButtons: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    filter: PropTypes.object,
    filterDefaultValues: PropTypes.object,
    filters: PropTypes.element,
    pagination: PropTypes.element,
    perPage: PropTypes.number.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    title: TitlePropType,
    // the props managed by react-admin
    authProvider: PropTypes.func,
    hasCreate: PropTypes.bool.isRequired,
    hasEdit: PropTypes.bool.isRequired,
    hasList: PropTypes.bool.isRequired,
    hasShow: PropTypes.bool.isRequired,
    location: PropTypes.object,
    match: PropTypes.object,
    path: PropTypes.string,
    resource: PropTypes.string.isRequired,
};

List.defaultProps = {
    filter: {},
    perPage: 10,
};

export const ListView = props => {
    const {
        actions,
        aside,
        filter,
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
    useCheckMinimumRequiredProps('List', ['children'], props);
    const classes = useStyles({ classes: classesOverride });
    const {
        defaultTitle,
        version,
        total,
        loaded,
        loading,
        hasCreate,
        filterValues,
    } = rest;
    const controllerProps = getListControllerProps(rest);

    const renderList = () => (
        <>
            {(filters || actions) && (
                <ListToolbar
                    filters={filters}
                    {...controllerProps}
                    actions={actions}
                    exporter={exporter} // deprecated, use ExporterContext instead
                    permanentFilter={filter}
                />
            )}
            <div className={classes.main}>
                <Content
                    className={classnames(classes.content, {
                        [classes.bulkActionsDisplayed]:
                            controllerProps.selectedIds.length > 0,
                    })}
                    key={version}
                >
                    {bulkActionButtons !== false && bulkActionButtons && (
                        <BulkActionsToolbar {...controllerProps}>
                            {bulkActionButtons}
                        </BulkActionsToolbar>
                    )}
                    {children &&
                        cloneElement(Children.only(children), {
                            ...controllerProps,
                            hasBulkActions: bulkActionButtons !== false,
                        })}
                    {pagination && cloneElement(pagination, controllerProps)}
                </Content>
                {aside && cloneElement(aside, controllerProps)}
            </div>
        </>
    );

    const shouldRenderEmptyPage =
        hasCreate &&
        loaded &&
        !loading &&
        !total &&
        !Object.keys(filterValues).length;

    return (
        <ExporterContext.Provider value={exporter}>
            <div
                className={classnames('list-page', classes.root, className)}
                {...sanitizeRestProps(rest)}
            >
                <Title title={title} defaultTitle={defaultTitle} />
                {shouldRenderEmptyPage
                    ? cloneElement(empty, controllerProps)
                    : renderList()}
            </div>
        </ExporterContext.Provider>
    );
};

ListView.propTypes = {
    actions: PropTypes.element,
    aside: PropTypes.element,
    basePath: PropTypes.string,
    bulkActionButtons: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    children: PropTypes.element,
    className: PropTypes.string,
    classes: PropTypes.object,
    component: ComponentPropType,
    currentSort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.object,
    defaultTitle: PropTypes.string,
    displayedFilters: PropTypes.object,
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filterDefaultValues: PropTypes.object,
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    hideFilter: PropTypes.func,
    ids: PropTypes.array,
    loading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    onUnselectItems: PropTypes.func,
    page: PropTypes.number,
    pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
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

const sanitizeRestProps = ({
    actions,
    basePath,
    changeListParams,
    children,
    classes,
    className,
    crudGetList,
    currentSort,
    data,
    defaultTitle,
    displayedFilters,
    exporter,
    filter,
    filterDefaultValues,
    filters,
    filterValues,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    hideFilter,
    history,
    ids,
    loading,
    loaded,
    locale,
    location,
    match,
    onSelect,
    onToggleItem,
    onUnselectItems,
    options,
    page,
    pagination,
    params,
    permissions,
    perPage,
    push,
    query,
    refresh,
    resource,
    selectedIds,
    setFilters,
    setPage,
    setPerPage,
    setSelectedIds,
    setSort,
    showFilter,
    sort,
    title,
    toggleItem,
    total,
    version,
    empty,
    ...rest
}) => rest;

export default List;
