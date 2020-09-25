import * as React from 'react';
import { FC } from 'react';
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
const List: FC<ListProps> = props => {
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
    filters: PropTypes.element,
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
    hasCreate: PropTypes.bool.isRequired,
    hasEdit: PropTypes.bool.isRequired,
    hasList: PropTypes.bool.isRequired,
    hasShow: PropTypes.bool.isRequired,
    location: PropTypes.any,
    match: PropTypes.any,
    path: PropTypes.string,
    resource: PropTypes.string.isRequired,
};

List.defaultProps = {
    filter: {},
    perPage: 10,
};

export default List;
