import * as React from 'react';
import { FC, memo, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    ListContextProvider,
    useListContext,
    ListControllerProps,
    useReferenceArrayFieldController,
    SortPayload,
    FilterPayload,
    ResourceContextProvider,
    useRecordContext,
} from 'ra-core';

import { fieldPropTypes, PublicFieldProps, InjectedFieldProps } from './types';
import { LinearProgress } from '../layout';

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
 * <ReferenceArrayField label="Products" reference="products" source="product_ids">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="description" />
 *         <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceArrayField>
 *
 * @example Display all the categories of the current product as a list of chips
 * // product = {
 * //   id: 456,
 * //   category_ids: [11, 22, 33],
 * // }
 * <ReferenceArrayField label="Categories" reference="categories" source="category_ids">
 *     <SingleFieldList>
 *         <ChipField source="name" />
 *     </SingleFieldList>
 * </ReferenceArrayField>
 *
 * By default, restricts the displayed values to 1000. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceArrayField perPage={10} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayField>
 *
 * By default, the field displays the results in the order in which they are referenced
 * (i.e. in the order of the list of ids). You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceArrayField sort={{ field: 'name', order: 'ASC' }} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayField>
 *
 * Also, you can filter the results to display only a subset of values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceArrayField filter={{ is_published: true }} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayField>
 */
export const ReferenceArrayField: FC<ReferenceArrayFieldProps> = props => {
    const {
        filter,
        page = 1,
        perPage,
        reference,
        resource,
        sort,
        source,
    } = props;
    const record = useRecordContext(props);
    const controllerProps = useReferenceArrayFieldController({
        filter,
        page,
        perPage,
        record,
        reference,
        resource,
        sort,
        source,
    });
    return (
        <ResourceContextProvider value={reference}>
            <ListContextProvider value={controllerProps}>
                <PureReferenceArrayFieldView {...props} />
            </ListContextProvider>
        </ResourceContextProvider>
    );
};

ReferenceArrayField.propTypes = {
    ...fieldPropTypes,
    addLabel: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.element.isRequired,
    label: PropTypes.string,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sortBy: PropTypes.string,
    sortByOrder: fieldPropTypes.sortByOrder,
    source: PropTypes.string.isRequired,
};

ReferenceArrayField.defaultProps = {
    addLabel: true,
};

export interface ReferenceArrayFieldProps
    extends PublicFieldProps,
        InjectedFieldProps {
    children: ReactElement;
    filter?: FilterPayload;
    page?: number;
    pagination?: ReactElement;
    perPage?: number;
    reference: string;
    resource?: string;
    sort?: SortPayload;
}

export interface ReferenceArrayFieldViewProps
    extends Omit<
            ReferenceArrayFieldProps,
            'basePath' | 'resource' | 'page' | 'perPage'
        >,
        ListControllerProps {}

export const ReferenceArrayFieldView: FC<ReferenceArrayFieldViewProps> = props => {
    const { children, pagination, className } = props;
    const { isLoading, total } = useListContext(props);

    return isLoading ? (
        <LinearProgress sx={{ mt: 2 }} />
    ) : (
        <span className={className}>
            {children}
            {pagination && total !== undefined ? pagination : null}
        </span>
    );
};

ReferenceArrayFieldView.propTypes = {
    className: PropTypes.string,
    children: PropTypes.element.isRequired,
    reference: PropTypes.string.isRequired,
};

const PureReferenceArrayFieldView = memo(ReferenceArrayFieldView);
