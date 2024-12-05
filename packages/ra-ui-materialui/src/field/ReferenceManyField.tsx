import React, { ReactElement, ReactNode } from 'react';
import {
    useReferenceManyFieldController,
    ListContextProvider,
    ResourceContextProvider,
    useRecordContext,
    RaRecord,
    UseReferenceManyFieldControllerParams,
} from 'ra-core';

import { FieldProps } from './types';

/**
 * Render related records to the current one.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 *
 * @example Display all the books by the current author, only the title
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * By default, restricts the displayed values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceManyField perPage={10} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceManyField sort={{ field: 'created_at', order: 'DESC' }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceManyField filter={{ is_published: true }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 */
export const ReferenceManyField = <
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    props: ReferenceManyFieldProps<RecordType, ReferenceRecordType>
) => {
    const {
        children,
        debounce,
        filter = defaultFilter,
        page = 1,
        pagination = null,
        perPage = 25,
        reference,
        resource,
        sort = defaultSort,
        source = 'id',
        storeKey,
        target,
        queryOptions,
    } = props;
    const record = useRecordContext(props);

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

    return (
        <ResourceContextProvider value={reference}>
            <ListContextProvider value={controllerProps}>
                {children}
                {pagination}
            </ListContextProvider>
        </ResourceContextProvider>
    );
};

export interface ReferenceManyFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends Record<string, any> = Record<string, any>,
> extends Omit<FieldProps<RecordType>, 'source'>,
        UseReferenceManyFieldControllerParams<RecordType, ReferenceRecordType> {
    children: ReactNode;
    pagination?: ReactElement;
}

const defaultFilter = {};
const defaultSort = { field: 'id', order: 'DESC' as const };
