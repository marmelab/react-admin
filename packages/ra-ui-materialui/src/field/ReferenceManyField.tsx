import React from 'react';
import {
    ReferenceManyFieldBase,
    useTranslate,
    type ReferenceManyFieldBaseProps,
    type RaRecord,
} from 'ra-core';

import { Typography } from '@mui/material';
import type { FieldProps } from './types';
import { Offline } from '../Offline';

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
    const translate = useTranslate();
    const {
        children,
        pagination,
        empty,
        offline = defaultOffline,
        render,
        ...controllerProps
    } = props;

    return (
        <ReferenceManyFieldBase<RecordType, ReferenceRecordType>
            {...controllerProps}
            empty={
                typeof empty === 'string' ? (
                    <Typography component="span" variant="body2">
                        {translate(empty, { _: empty })}
                    </Typography>
                ) : (
                    empty
                )
            }
            render={props => {
                const { isPaused, isPending, isPlaceholderData } = props;
                const shouldRenderOffline =
                    isPaused &&
                    (isPending || isPlaceholderData) &&
                    offline !== undefined &&
                    offline !== false;

                return (
                    <>
                        {shouldRenderOffline
                            ? offline
                            : render
                              ? render(props)
                              : children}
                        {pagination}
                    </>
                );
            }}
        />
    );
};

const defaultOffline = <Offline variant="inline" />;

export interface ReferenceManyFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends RaRecord = RaRecord,
> extends Omit<FieldProps<RecordType>, 'source'>,
        ReferenceManyFieldBaseProps<RecordType, ReferenceRecordType> {
    pagination?: React.ReactNode;
}
