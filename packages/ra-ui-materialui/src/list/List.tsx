import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    useCheckMinimumRequiredProps,
    useListController,
    ListContextProvider,
} from 'ra-core';

import { TitlePropType } from '../layout/Title';

import ListView from './ListView';
import { ListProps } from '../types';

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
 * - bulkActionButtons
 * - component
 * - empty
 * - exporter
 * - filter (the permanent filter to apply to the query)
 * - filterDefaultValues (the default values for `alwaysOn` filters)
 * - filters (a list of inputs used to display the filter button/form combo)
 * - pagination
 * - perPage
 * - sort
 * - title
 * - syncWithLocation
 *
 * @example
 *
 * const postFilters = [
 *     <TextInput label="Search" source="q" alwaysOn />,
 *     <TextInput label="Title" source="title" />
 * ];
 * export const PostList = (props) => (
 *     <List {...props}
 *         title="List of posts"
 *         sort={{ field: 'published_at' }}
 *         filter={{ is_published: true }}
 *         filters={postFilters}
 *     >
 *         <Datagrid>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <EditButton />
 *         </Datagrid>
 *     </List>
 * );
 */
const List = (props: ListProps & { children: ReactElement }): ReactElement => {
    useCheckMinimumRequiredProps('List', ['children'], props);
    const controllerProps = useListController(props);
    return (
        <ListContextProvider value={controllerProps}>
            <ListView {...props} {...controllerProps} />
        </ListContextProvider>
    );
};

List.propTypes = {
    // the props you can change
    // @ts-ignore-line
    actions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    aside: PropTypes.element,
    // @ts-ignore-line
    bulkActionButtons: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    filter: PropTypes.object,
    filterDefaultValues: PropTypes.object,
    filters: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]),
    // @ts-ignore-line
    pagination: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    perPage: PropTypes.number.isRequired,
    //@ts-ignore-line
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    title: TitlePropType,
    // the props managed by react-admin
    authProvider: PropTypes.func,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    location: PropTypes.any,
    match: PropTypes.any,
    path: PropTypes.string,
    resource: PropTypes.string,
    syncWithLocation: PropTypes.bool,
};

List.defaultProps = {
    filter: {},
    perPage: 10,
};

export default List;
