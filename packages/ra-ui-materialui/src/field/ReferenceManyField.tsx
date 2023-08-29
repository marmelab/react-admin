import React, { FC, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
    FilterPayload,
    SortPayload,
    useReferenceManyFieldController,
    ListContextProvider,
    ListControllerResult,
    ResourceContextProvider,
    useRecordContext,
    RaRecord,
} from 'ra-core';

import { fieldPropTypes, FieldProps } from './types';

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
    ReferenceRecordType extends RaRecord = RaRecord
>(
    props: ReferenceManyFieldProps<RecordType>
) => {
    const {
        children,
        filter = defaultFilter,
        page = 1,
        pagination = null,
        perPage = 25,
        reference,
        resource,
        sort = defaultSort,
        source = 'id',
        target,
    } = props;
    const record = useRecordContext(props);

    const controllerProps = useReferenceManyFieldController<
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
        target,
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
    RecordType extends Record<string, any> = Record<string, any>
> extends FieldProps<RecordType> {
    children: ReactNode;
    filter?: FilterPayload;
    page?: number;
    pagination?: ReactElement;
    perPage?: number;
    reference: string;
    sort?: SortPayload;
    target: string;
}

ReferenceManyField.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    filter: PropTypes.object,
    label: fieldPropTypes.label,
    perPage: PropTypes.number,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sortBy: PropTypes.string,
    sortByOrder: fieldPropTypes.sortByOrder,
    source: PropTypes.string,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC'] as const),
    }),
    target: PropTypes.string.isRequired,
};

// FIXME kept for backwards compatibility, unused, to be removed in v5
export const ReferenceManyFieldView: FC<ReferenceManyFieldViewProps> = props => {
    const { children, pagination } = props;
    if (process.env.NODE_ENV !== 'production') {
        console.error(
            '<ReferenceManyFieldView> is deprecated, use <ReferenceManyField> directly'
        );
    }
    return (
        <>
            {children}
            {pagination && props.total !== undefined ? pagination : null}
        </>
    );
};

export interface ReferenceManyFieldViewProps
    extends Omit<
            ReferenceManyFieldProps,
            'resource' | 'page' | 'perPage' | 'sort'
        >,
        ListControllerResult {
    children: ReactElement;
}

ReferenceManyFieldView.propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC'] as const),
    }),
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    pagination: PropTypes.element,
    reference: PropTypes.string,
    setSort: PropTypes.func,
};

const defaultFilter = {};
const defaultSort = { field: 'id', order: 'DESC' as const };
