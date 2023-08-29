import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    InfiniteListBase,
    InfiniteListControllerProps,
    RaRecord,
} from 'ra-core';

import { TitlePropType } from '../layout/Title';
import { InfinitePagination } from './pagination';
import { ListView, ListViewProps } from './ListView';

/**
 * Infinite List page component
 *
 * The <InfiniteList> component renders the list layout (title, buttons, filters),
 * and fetches the list of records from the REST API.
 *
 * It then delegates the rendering of the list of records to its child component.
 * Usually, it's a <Datagrid>, responsible for displaying a table with one row for each post.
 *
 * It contains an <InfinitePagination> component, which fetches the next page of records
 * when the user scrolls to the bottom of the list.
 *
 * The <InfiniteList> component accepts the following props:
 *
 * - actions
 * - aside: Side Component
 * - children: List Layout
 * - component
 * - disableAuthentication
 * - disableSyncWithLocation
 * - empty: Empty Page Component
 * - emptyWhileLoading
 * - exporter
 * - filters: Filter Inputs
 * - filter: Permanent Filter
 * - filterDefaultValues
 * - pagination: Pagination Component
 * - perPage: Pagination Size
 * - queryOptions
 * - sort: Default Sort Field & Order
 * - title
 * - sx: CSS API
 *
 * @example
 * const postFilters = [
 *     <TextInput label="Search" source="q" alwaysOn />,
 *     <TextInput label="Title" source="title" />
 * ];
 * export const PostList = () => (
 *     <InfiniteList
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
export const InfiniteList = <RecordType extends RaRecord = any>({
    debounce,
    disableAuthentication,
    disableSyncWithLocation,
    exporter,
    filter = defaultFilter,
    filterDefaultValues,
    pagination = defaultPagination,
    perPage = 10,
    queryOptions,
    resource,
    sort,
    storeKey,
    ...rest
}: InfiniteListProps<RecordType>): ReactElement => (
    <InfiniteListBase<RecordType>
        debounce={debounce}
        disableAuthentication={disableAuthentication}
        disableSyncWithLocation={disableSyncWithLocation}
        exporter={exporter}
        filter={filter}
        filterDefaultValues={filterDefaultValues}
        perPage={perPage}
        queryOptions={queryOptions}
        resource={resource}
        sort={sort}
        storeKey={storeKey}
    >
        <ListView<RecordType> {...rest} pagination={pagination} />
    </InfiniteListBase>
);

const defaultPagination = <InfinitePagination />;
const defaultFilter = {};

export interface InfiniteListProps<RecordType extends RaRecord = any>
    extends InfiniteListControllerProps<RecordType>,
        ListViewProps {}

InfiniteList.propTypes = {
    // the props you can change
    // @ts-ignore-line
    actions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    aside: PropTypes.element,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    emptyWhileLoading: PropTypes.bool,
    filter: PropTypes.object,
    filterDefaultValues: PropTypes.object,
    filters: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]),
    // @ts-ignore-line
    pagination: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    perPage: PropTypes.number,
    //@ts-ignore-line
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC'] as const),
    }),
    sx: PropTypes.any,
    title: TitlePropType,
    // the props managed by react-admin
    disableSyncWithLocation: PropTypes.bool,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    resource: PropTypes.string,
};
