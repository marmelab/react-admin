import React, { ReactNode } from 'react';
import { ResourceContextProvider } from '../../core';
import { ListContextProvider } from '../list/ListContextProvider';
import {
    useReferenceManyFieldController,
    type UseReferenceManyFieldControllerParams,
} from './useReferenceManyFieldController';
import type { RaRecord } from '../../types';

/**
 * Render related records to the current one.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyFieldBase reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyFieldBase>
 *
 * @example Display all the books by the current author, only the title
 * <ReferenceManyFieldBase reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyFieldBase>
 *
 * By default, restricts the displayed values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceManyFieldBase perPage={10} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyFieldBase>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceManyFieldBase sort={{ field: 'created_at', order: 'DESC' }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyFieldBase>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceManyFieldBase filter={{ is_published: true }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyFieldBase>
 */
export const ReferenceManyFieldBase = <
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    props: ReferenceManyFieldBaseProps<RecordType, ReferenceRecordType>
) => {
    const {
        children,
        debounce,
        empty,
        filter = defaultFilter,
        page = 1,
        pagination = null,
        perPage = 25,
        record,
        reference,
        resource,
        sort = defaultSort,
        source = 'id',
        storeKey,
        target,
        queryOptions,
    } = props;

    const controllerProps = useReferenceManyFieldController<
        RecordType,
        ReferenceRecordType
    >({
        debounce,
        filter,
        page,
        perPage,
        record,
        reference,
        resource,
        sort,
        source,
        storeKey,
        target,
        queryOptions,
    });

    if (
        // there is an empty page component
        empty &&
        // there is no error
        !controllerProps.error &&
        // the list is not loading data for the first time
        !controllerProps.isPending &&
        // the API returned no data (using either normal or partial pagination)
        (controllerProps.total === 0 ||
            (controllerProps.total == null &&
                // @ts-ignore FIXME total may be undefined when using partial pagination but the ListControllerResult type is wrong about it
                controllerProps.hasPreviousPage === false &&
                // @ts-ignore FIXME total may be undefined when using partial pagination but the ListControllerResult type is wrong about it
                controllerProps.hasNextPage === false &&
                // @ts-ignore FIXME total may be undefined when using partial pagination but the ListControllerResult type is wrong about it
                controllerProps.data.length === 0)) &&
        // the user didn't set any filters
        !Object.keys(controllerProps.filterValues).length
    ) {
        return empty;
    }

    return (
        <ResourceContextProvider value={reference}>
            <ListContextProvider value={controllerProps}>
                {children}
                {pagination}
            </ListContextProvider>
        </ResourceContextProvider>
    );
};

export interface ReferenceManyFieldBaseProps<
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends Record<string, any> = Record<string, any>,
> extends UseReferenceManyFieldControllerParams<
        RecordType,
        ReferenceRecordType
    > {
    children: ReactNode;
    empty?: ReactNode;
    pagination?: ReactNode;
}

const defaultFilter = {};
const defaultSort = { field: 'id', order: 'DESC' as const };
