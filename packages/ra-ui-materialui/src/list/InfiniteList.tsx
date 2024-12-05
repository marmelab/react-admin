import * as React from 'react';
import { ReactElement } from 'react';
import { InfiniteListBase, InfiniteListBaseProps, RaRecord } from 'ra-core';

import { InfinitePagination } from './pagination';
import { ListView, ListViewProps } from './ListView';
import { Loading } from '../layout';

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
    loading = defaultLoading,
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
        loading={loading}
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
const defaultLoading = <Loading />;

export interface InfiniteListProps<RecordType extends RaRecord = any>
    extends InfiniteListBaseProps<RecordType>,
        ListViewProps {}
