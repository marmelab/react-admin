import * as React from 'react';
import { FC, memo, ReactElement, ReactNode } from 'react';
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
    useResourceDefinition,
    RaRecord,
} from 'ra-core';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';

import { fieldPropTypes, FieldProps } from './types';
import { LinearProgress } from '../layout';
import { SingleFieldList } from '../list/SingleFieldList';
import { ChipField } from './ChipField';

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
export const ReferenceArrayField = <
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord
>(
    props: ReferenceArrayFieldProps<RecordType>
) => {
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
    className: PropTypes.string,
    children: PropTypes.node,
    label: fieldPropTypes.label,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sortBy: PropTypes.string,
    sortByOrder: fieldPropTypes.sortByOrder,
    source: PropTypes.string.isRequired,
};

export interface ReferenceArrayFieldProps<
    RecordType extends RaRecord = RaRecord
> extends FieldProps<RecordType> {
    children?: ReactNode;
    filter?: FilterPayload;
    page?: number;
    pagination?: ReactElement;
    perPage?: number;
    reference: string;
    sort?: SortPayload;
    sx?: SxProps;
}

export interface ReferenceArrayFieldViewProps
    extends Omit<ReferenceArrayFieldProps, 'resource' | 'page' | 'perPage'>,
        ListControllerProps {}

export const ReferenceArrayFieldView: FC<ReferenceArrayFieldViewProps> = props => {
    const { children, pagination, reference, className, sx } = props;
    const { isLoading, total } = useListContext(props);

    const { recordRepresentation } = useResourceDefinition({
        resource: reference,
    });
    let child = children ? (
        children
    ) : (
        <SingleFieldList>
            <ChipField
                source={
                    typeof recordRepresentation === 'string'
                        ? recordRepresentation
                        : 'id'
                }
                size="small"
            />
        </SingleFieldList>
    );

    return (
        <Root className={className} sx={sx}>
            {isLoading ? (
                <LinearProgress
                    className={ReferenceArrayFieldClasses.progress}
                />
            ) : (
                <span>
                    {child}
                    {pagination && total !== undefined ? pagination : null}
                </span>
            )}
        </Root>
    );
};

ReferenceArrayFieldView.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    reference: PropTypes.string.isRequired,
};

const PREFIX = 'RaReferenceArrayField';

export const ReferenceArrayFieldClasses = {
    progress: `${PREFIX}-progress`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${ReferenceArrayFieldClasses.progress}`]: {
        marginTop: theme.spacing(2),
    },
}));

const PureReferenceArrayFieldView = memo(ReferenceArrayFieldView);
