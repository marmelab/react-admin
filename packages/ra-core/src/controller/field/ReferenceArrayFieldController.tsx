import { FunctionComponent, ReactNode, ReactElement } from 'react';

import useReferenceArray from './useReferenceArray';
import { Identifier, RecordMap, Record, Sort } from '../..';

interface ChildrenFuncParams {
    loadedOnce: boolean;
    ids: Identifier[];
    data: RecordMap;
    referenceBasePath: string;
    currentSort: Sort;
}

interface Props {
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    record?: Record;
    reference: string;
    resource: string;
    source: string;
}

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
 */
const ReferenceArrayFieldController: FunctionComponent<Props> = ({
    resource,
    reference,
    basePath,
    record,
    source,
    children,
}) => {
    return children({
        currentSort: {
            field: 'id',
            order: 'ASC',
        },
        ...useReferenceArray({
            resource,
            reference,
            basePath,
            record,
            source,
        }),
    }) as ReactElement<any>;
};

export default ReferenceArrayFieldController;
