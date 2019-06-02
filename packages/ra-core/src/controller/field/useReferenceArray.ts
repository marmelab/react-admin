import { FunctionComponent, ReactNode, useEffect, ReactElement } from 'react';
// @ts-ignore
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyAccumulate } from '../../actions';
import { getReferencesByIds } from '../../reducer/admin/references/oneToMany';
import { ReduxState, Record, RecordMap, Sort, Identifier } from '../../types';

interface ReferenceArrayProps {
    loadedOnce: boolean;
    ids: Identifier[];
    data: RecordMap;
    referenceBasePath: string;
    currentSort: Sort;
}

interface Option {
    basePath: string;
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
const useReferenceArray = ({
    resource,
    reference,
    basePath,
    record,
    source,
}: Option): ReferenceArrayProps => {
    const dispatch = useDispatch();
    const { data, ids } = useSelector(
        getReferenceArray({ record, source, reference }),
        [record, source, reference]
    );
    useEffect(() => {
        dispatch(crudGetManyAccumulate(reference, ids));
    }, [reference, ids, record.id]);

    const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak

    return {
        // tslint:disable-next-line:triple-equals
        loadedOnce: data != undefined,
        ids,
        data,
        referenceBasePath,
        currentSort: {
            field: 'id',
            order: 'ASC',
        },
    };
};

const getReferenceArray = ({ record, source, reference }) => (
    state: ReduxState
) => {
    const ids = get(record, source) || [];
    return {
        data: getReferencesByIds(state, reference, ids),
        ids,
    };
};

export default useReferenceArray;
