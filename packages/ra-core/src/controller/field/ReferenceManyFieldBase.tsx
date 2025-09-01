import React, { ReactNode } from 'react';
import { ResourceContextProvider } from '../../core';
import { ListContextProvider } from '../list/ListContextProvider';
import {
    useReferenceManyFieldController,
    type UseReferenceManyFieldControllerParams,
} from './useReferenceManyFieldController';
import type { RaRecord } from '../../types';
import { ListControllerResult } from '../list';

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
        render,
        debounce,
        empty,
        error,
        loading,
        filter = defaultFilter,
        offline,
        page = 1,
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

    if (!render && !children) {
        throw new Error(
            "<ReferenceManyFieldBase> requires either a 'render' prop or 'children' prop"
        );
    }

    const {
        data,
        error: controllerError,
        filterValues,
        hasNextPage,
        hasPreviousPage,
        isPaused,
        isPending,
        isPlaceholderData,
        total,
    } = controllerProps;

    const shouldRenderLoading =
        isPending && !isPaused && loading !== false && loading !== undefined;
    const shouldRenderOffline =
        isPaused &&
        (isPending || isPlaceholderData) &&
        offline !== false &&
        offline !== undefined;
    const shouldRenderError =
        controllerError && error !== false && error !== undefined;
    const shouldRenderEmpty =
        empty !== false &&
        empty !== undefined &&
        // there is no error
        !error &&
        // the list is not loading data for the first time
        !isPending &&
        // the API returned no data (using either normal or partial pagination)
        (total === 0 ||
            (total == null &&
                // @ts-ignore FIXME total may be undefined when using partial pagination but the ListControllerResult type is wrong about it
                hasPreviousPage === false &&
                // @ts-ignore FIXME total may be undefined when using partial pagination but the ListControllerResult type is wrong about it
                hasNextPage === false &&
                // @ts-ignore FIXME total may be undefined when using partial pagination but the ListControllerResult type is wrong about it
                data.length === 0)) &&
        // the user didn't set any filters
        !Object.keys(filterValues).length;

    return (
        <ResourceContextProvider value={reference}>
            <ListContextProvider value={controllerProps}>
                {shouldRenderLoading
                    ? loading
                    : shouldRenderOffline
                      ? offline
                      : shouldRenderError
                        ? error
                        : shouldRenderEmpty
                          ? empty
                          : render
                            ? render(controllerProps)
                            : children}
            </ListContextProvider>
        </ResourceContextProvider>
    );
};

export interface ReferenceManyFieldBaseProps<
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends RaRecord = RaRecord,
> extends UseReferenceManyFieldControllerParams<
        RecordType,
        ReferenceRecordType
    > {
    children?: ReactNode;
    render?: (props: ListControllerResult<ReferenceRecordType>) => ReactNode;
    empty?: ReactNode;
    error?: ReactNode;
    loading?: ReactNode;
    offline?: ReactNode;
}

const defaultFilter = {};
const defaultSort = { field: 'id', order: 'DESC' as const };
