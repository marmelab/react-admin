import * as React from 'react';
import { type ReactNode } from 'react';

import type { UseQueryOptions } from '@tanstack/react-query';
import { FilterPayload, RaRecord, SortPayload } from '../../types';
import { useRecordContext } from '../record';
import { useReferenceArrayFieldController } from './useReferenceArrayFieldController';
import { ResourceContextProvider } from '../../core';
import { ListContextProvider, ListControllerResult } from '../list';
import { BaseFieldProps } from './types';

/**
 * A container component that fetches records from another resource specified
 * by an array of *ids* in current record.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the products of the current order as datagrid
 * // order = {
 * //   id: 123,
 * //   product_ids: [456, 457, 458],
 * // }
 * <ReferenceArrayFieldBase label="Products" reference="products" source="product_ids">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="description" />
 *         <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceArrayFieldBase>
 *
 * @example Display all the categories of the current product as a list of chips
 * // product = {
 * //   id: 456,
 * //   category_ids: [11, 22, 33],
 * // }
 * <ReferenceArrayFieldBase label="Categories" reference="categories" source="category_ids">
 *     <SingleFieldList>
 *         <ChipField source="name" />
 *     </SingleFieldList>
 * </ReferenceArrayFieldBase>
 *
 * By default, restricts the displayed values to 1000. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceArrayFieldBase perPage={10} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayFieldBase>
 *
 * By default, the field displays the results in the order in which they are referenced
 * (i.e. in the order of the list of ids). You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceArrayFieldBase sort={{ field: 'name', order: 'ASC' }} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayFieldBase>
 *
 * Also, you can filter the results to display only a subset of values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceArrayFieldBase filter={{ is_published: true }} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayFieldBase>
 */
export const ReferenceArrayFieldBase = <
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    props: ReferenceArrayFieldBaseProps<RecordType, ReferenceRecordType>
) => {
    const {
        children,
        render,
        error,
        loading,
        empty,
        filter,
        offline,
        page = 1,
        perPage,
        reference,
        resource,
        sort,
        source,
        queryOptions,
    } = props;
    const record = useRecordContext(props);
    const controllerProps = useReferenceArrayFieldController<
        RecordType,
        ReferenceRecordType
    >({
        filter,
        page,
        perPage,
        record,
        reference,
        resource,
        sort,
        source,
        queryOptions,
    });

    if (!render && !children) {
        throw new Error(
            "<ReferenceArrayFieldBase> requires either a 'render' prop or 'children' prop"
        );
    }
    const {
        error: controllerError,
        isPending,
        isPaused,
        isPlaceholderData,
    } = controllerProps;

    const shouldRenderLoading =
        isPending && !isPaused && loading !== undefined && loading !== false;
    const shouldRenderOffline =
        isPaused &&
        (isPending || isPlaceholderData) &&
        offline !== undefined &&
        offline !== false;
    const shouldRenderError =
        !isPending &&
        !isPaused &&
        controllerError &&
        error !== undefined &&
        error !== false;
    const shouldRenderEmpty = // there is an empty page component
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
        !Object.keys(controllerProps.filterValues).length;

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

export interface ReferenceArrayFieldBaseProps<
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
> extends BaseFieldProps<RecordType> {
    children?: ReactNode;
    render?: (props: ListControllerResult<ReferenceRecordType>) => ReactNode;
    error?: ReactNode;
    loading?: ReactNode;
    empty?: ReactNode;
    filter?: FilterPayload;
    offline?: ReactNode;
    page?: number;
    perPage?: number;
    reference: string;
    sort?: SortPayload;
    queryOptions?: Omit<
        UseQueryOptions<ReferenceRecordType[], Error>,
        'queryFn' | 'queryKey'
    >;
}
