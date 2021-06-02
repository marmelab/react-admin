import React, { FC, cloneElement, Children, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    FilterPayload,
    SortPayload,
    useReferenceManyFieldController,
    ListContextProvider,
    ListControllerProps,
    ResourceContextProvider,
    useRecordContext,
    ReduxState,
} from 'ra-core';
import { useSelector } from 'react-redux';

import { PublicFieldProps, fieldPropTypes, InjectedFieldProps } from './types';
import sanitizeFieldRestProps from './sanitizeFieldRestProps';

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
export const ReferenceManyField: FC<ReferenceManyFieldProps> = props => {
    const {
        basePath,
        children,
        filter,
        page = 1,
        perPage,
        reference,
        resource,
        sort,
        source,
        target,
    } = props;
    const record = useRecordContext(props);

    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceManyField> only accepts a single child (like <Datagrid>)'
        );
    }

    const isReferenceDeclared = useSelector<ReduxState, boolean>(
        state => typeof state.admin.resources[props.reference] !== 'undefined'
    );

    if (!isReferenceDeclared) {
        throw new Error(
            `You must declare a <Resource name="${props.reference}"> in order to use a <ReferenceManyField reference="${props.reference}">`
        );
    }

    const controllerProps = useReferenceManyFieldController({
        basePath,
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
                <ReferenceManyFieldView {...props} {...controllerProps} />
            </ListContextProvider>
        </ResourceContextProvider>
    );
};

export interface ReferenceManyFieldProps
    extends PublicFieldProps,
        InjectedFieldProps {
    children: ReactElement;
    filter?: FilterPayload;
    page?: number;
    pagination?: ReactElement;
    perPage?: number;
    reference: string;
    sort?: SortPayload;
    target: string;
}

ReferenceManyField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    filter: PropTypes.object,
    label: PropTypes.string,
    perPage: PropTypes.number,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sortBy: PropTypes.string,
    sortByOrder: fieldPropTypes.sortByOrder,
    source: PropTypes.string.isRequired,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    target: PropTypes.string.isRequired,
};

ReferenceManyField.defaultProps = {
    filter: {},
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    source: 'id',
    addLabel: true,
};

export const ReferenceManyFieldView: FC<ReferenceManyFieldViewProps> = props => {
    const { basePath, children, pagination, reference, ...rest } = props;
    return (
        <>
            {cloneElement(Children.only(children), {
                ...sanitizeFieldRestProps(rest),
                basePath,
                resource: reference,
            })}
            {pagination &&
                props.total !== undefined &&
                cloneElement(pagination)}
        </>
    );
};

export interface ReferenceManyFieldViewProps
    extends Omit<
            ReferenceManyFieldProps,
            'basePath' | 'resource' | 'page' | 'perPage'
        >,
        ListControllerProps {
    children: ReactElement;
}

ReferenceManyFieldView.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.element,
    className: PropTypes.string,
    currentSort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.any,
    ids: PropTypes.array,
    loaded: PropTypes.bool,
    pagination: PropTypes.element,
    reference: PropTypes.string,
    setSort: PropTypes.func,
};

export default ReferenceManyField;
