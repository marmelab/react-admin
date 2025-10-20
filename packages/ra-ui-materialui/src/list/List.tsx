import * as React from 'react';
import { ReactElement } from 'react';
import { ListBase, ListBaseProps, RaRecord } from 'ra-core';
import { useThemeProps } from '@mui/material/styles';

import { ListView, ListViewProps } from './ListView';
import { Loading } from '../layout';

/**
 * List page component
 *
 * The <List> component renders the list layout (title, buttons, filters, pagination),
 * and fetches the list of records from the REST API.
 *
 * It then delegates the rendering of the list of records to its child component.
 * Usually, it's a <Datagrid>, responsible for displaying a table with one row for each post.
 *
 * The <List> component accepts the following props:
 *
 * - actions
 * - aside: Side Component
 * - children: List Layout
 * - render: alternative to children Function to render the List Layout, receive the list context as argument
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
 *     <List
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
export const List = <RecordType extends RaRecord = any>(
    props: ListProps<RecordType>
): ReactElement => {
    const {
        debounce,
        disableAuthentication,
        disableSyncWithLocation,
        exporter,
        filter = defaultFilter,
        filterDefaultValues,
        authLoading = defaultAuthLoading,
        loading,
        perPage = 10,
        queryOptions,
        resource,
        sort,
        storeKey,
        render,
        ...rest
    } = useThemeProps({
        props: props,
        name: PREFIX,
    });

    if (!props.render && !props.children) {
        throw new Error(
            '<List> requires either a `render` prop or `children` prop'
        );
    }

    return (
        <ListBase<RecordType>
            debounce={debounce}
            disableAuthentication={disableAuthentication}
            disableSyncWithLocation={disableSyncWithLocation}
            exporter={exporter}
            filter={filter}
            filterDefaultValues={filterDefaultValues}
            authLoading={authLoading}
            loading={loading}
            perPage={perPage}
            queryOptions={queryOptions}
            resource={resource}
            sort={sort}
            storeKey={storeKey}
            // Disable offline support from ListBase as it is handled by ListView to keep the ListView container
            offline={false}
        >
            <ListView<RecordType> {...rest} render={render} />
        </ListBase>
    );
};

export interface ListProps<RecordType extends RaRecord = any>
    extends Omit<ListBaseProps<RecordType>, 'children' | 'render'>,
        ListViewProps {}

const defaultFilter = {};
const defaultAuthLoading = <Loading />;

const PREFIX = 'RaList'; // Types declared in ListView.
