/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Header from '../layout/Header';
import Title from '../layout/Title';
import DefaultPagination from './Pagination';
import DefaultBulkActions from './BulkActions';
import DefaultActions from './ListActions';
import { ListController, getListControllerProps } from 'ra-core';
import defaultTheme from '../defaultTheme';

const styles = {
    root: {},
    actions: {
        zIndex: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },
    header: {},
    noResults: { padding: 20 },
};

const sanitizeRestProps = ({
    actions,
    basePath,
    bulkActions,
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
    isLoading,
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
    theme,
    title,
    toggleItem,
    total,
    translate,
    version,
    ...rest
}) => rest;

export const ListView = ({
    // component props
    actions = <DefaultActions />,
    filters,
    bulkActions = <DefaultBulkActions />,
    pagination = <DefaultPagination />,
    // overridable by user
    children,
    className,
    classes = {},
    exporter,
    title,
    ...rest
}) => {
    const { defaultTitle, isLoading, page, version, total, translate } = rest;
    const controllerProps = getListControllerProps(rest);
    const titleElement = <Title title={title} defaultTitle={defaultTitle} />;
    return (
        <div
            className={classnames('list-page', classes.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <Card>
                <Header
                    className={classes.header}
                    title={titleElement}
                    actions={React.cloneElement(actions, {
                        className: classes.actions,
                    })}
                    actionProps={{
                        ...controllerProps,
                        bulkActions,
                        exporter,
                        filters,
                    }}
                />
                {filters &&
                    React.cloneElement(filters, {
                        ...controllerProps,
                        context: 'form',
                    })}
                {isLoading || total > 0 ? (
                    <div key={version}>
                        {children &&
                            React.cloneElement(children, {
                                ...controllerProps,
                                hasBulkActions: !!bulkActions,
                            })}
                        {!isLoading &&
                            !rest.ids.length && (
                                <CardContent style={styles.noResults}>
                                    <Typography variant="body1">
                                        {translate(
                                            'ra.navigation.no_more_results',
                                            { page }
                                        )}
                                    </Typography>
                                </CardContent>
                            )}
                        {pagination &&
                            React.cloneElement(pagination, controllerProps)}
                    </div>
                ) : (
                    <CardContent className={classes.noResults}>
                        <Typography variant="body1">
                            {translate('ra.navigation.no_results')}
                        </Typography>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

ListView.propTypes = {
    actions: PropTypes.element,
    basePath: PropTypes.string,
    bulkActions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    children: PropTypes.element,
    className: PropTypes.string,
    classes: PropTypes.object,
    currentSort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.object,
    defaultTitle: PropTypes.string,
    displayedFilters: PropTypes.object,
    filterDefaultValues: PropTypes.object,
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    hideFilter: PropTypes.func,
    ids: PropTypes.array,
    isLoading: PropTypes.bool,
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
    title: PropTypes.any,
    total: PropTypes.number,
    translate: PropTypes.func,
    version: PropTypes.number,
};

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
 * Props:
 *   - title
 *   - perPage
 *   - sort
 *   - filter (the permanent filter to apply to the query)
 *   - actions
 *   - filters (a React Element used to display the filter form)
 *   - pagination
 *
 * @example
 *     const PostFilter = (props) => (
 *         <Filter {...props}>
 *             <TextInput label="Search" source="q" alwaysOn />
 *             <TextInput label="Title" source="title" />
 *         </Filter>
 *     );
 *     export const PostList = (props) => (
 *         <List {...props}
 *             title="List of posts"
 *             sort={{ field: 'published_at' }}
 *             filter={{ is_published: true }}
 *             filters={<PostFilter />}
 *         >
 *             <Datagrid>
 *                 <TextField source="id" />
 *                 <TextField source="title" />
 *                 <EditButton />
 *             </Datagrid>
 *         </List>
 *     );
 */
const List = props => (
    <ListController {...props}>
        {controllerProps => <ListView {...props} {...controllerProps} />}
    </ListController>
);

List.propTypes = {
    // the props you can change
    actions: PropTypes.element,
    bulkActions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
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
    title: PropTypes.any,
    // the props managed by react-admin
    authProvider: PropTypes.func,
    hasCreate: PropTypes.bool.isRequired,
    hasEdit: PropTypes.bool.isRequired,
    hasList: PropTypes.bool.isRequired,
    hasShow: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    path: PropTypes.string,
    resource: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
};

List.defaultProps = {
    filter: {},
    perPage: 10,
    theme: defaultTheme,
};

export default withStyles(styles)(List);
