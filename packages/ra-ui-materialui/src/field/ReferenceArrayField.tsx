import * as React from 'react';
import { FC, memo, ReactElement, ReactNode } from 'react';
import {
    ListContextProvider,
    useListContext,
    ListControllerProps,
    useReferenceArrayFieldController,
    SortPayload,
    FilterPayload,
    ResourceContextProvider,
    useRecordContext,
    RaRecord,
} from 'ra-core';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { UseQueryOptions } from '@tanstack/react-query';

import { FieldProps } from './types';
import { LinearProgress } from '../layout';
import { SingleFieldList } from '../list/SingleFieldList';

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
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    props: ReferenceArrayFieldProps<RecordType, ReferenceRecordType>
) => {
    const {
        filter,
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
    return (
        <ResourceContextProvider value={reference}>
            <ListContextProvider value={controllerProps}>
                <PureReferenceArrayFieldView {...props} />
            </ListContextProvider>
        </ResourceContextProvider>
    );
};
export interface ReferenceArrayFieldProps<
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
> extends FieldProps<RecordType> {
    children?: ReactNode;
    filter?: FilterPayload;
    page?: number;
    pagination?: ReactElement;
    perPage?: number;
    reference: string;
    sort?: SortPayload;
    sx?: SxProps;
    queryOptions?: UseQueryOptions<ReferenceRecordType[], Error>;
}

export interface ReferenceArrayFieldViewProps
    extends Omit<ReferenceArrayFieldProps, 'resource' | 'page' | 'perPage'>,
        Omit<ListControllerProps, 'queryOptions'> {}

export const ReferenceArrayFieldView: FC<
    ReferenceArrayFieldViewProps
> = props => {
    const { children, pagination, className, sx } = props;
    const { isPending, total } = useListContext();

    return (
        <Root className={className} sx={sx}>
            {isPending ? (
                <LinearProgress
                    className={ReferenceArrayFieldClasses.progress}
                />
            ) : (
                <span>
                    {children || <SingleFieldList />}
                    {pagination && total !== undefined ? pagination : null}
                </span>
            )}
        </Root>
    );
};

const PREFIX = 'RaReferenceArrayField';

export const ReferenceArrayFieldClasses = {
    progress: `${PREFIX}-progress`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'block',
    [`& .${ReferenceArrayFieldClasses.progress}`]: {
        marginTop: theme.spacing(2),
    },
}));

const PureReferenceArrayFieldView = memo(ReferenceArrayFieldView);
