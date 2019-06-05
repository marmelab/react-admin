import { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyAccumulate as crudGetManyAccumulateAction } from '../../actions';
import { getReferencesByIds } from '../../reducer/admin/references/oneToMany';
import { ReduxState, Record, RecordMap, Dispatch, Sort, Identifier } from '../../types';

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
    crudGetManyAccumulate: Dispatch<typeof crudGetManyAccumulateAction>;
    data?: RecordMap;
    ids: Identifier[];
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
export class UnconnectedReferenceArrayFieldController extends Component<Props> {
    componentDidMount() {
        this.fetchReferences();
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.record || { id: undefined }).id !== (nextProps.record || {}).id) {
            this.fetchReferences(nextProps);
        }
    }

    fetchReferences({ crudGetManyAccumulate, reference, ids } = this.props) {
        crudGetManyAccumulate(reference, ids);
    }

    render() {
        const { resource, reference, data, ids, children, basePath } = this.props;

        const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak

        return children({
            // tslint:disable-next-line:triple-equals
            loadedOnce: data != undefined,
            ids,
            data,
            referenceBasePath,
            currentSort: {
                field: 'id',
                order: 'ASC',
            },
        });
    }
}

const mapStateToProps = (state: ReduxState, props: Props) => {
    const { record, source, reference } = props;
    const ids = get(record, source) || [];
    return {
        data: getReferencesByIds(state, reference, ids),
        ids,
    };
};

const ReferenceArrayFieldController = connect(
    mapStateToProps,
    {
        crudGetManyAccumulate: crudGetManyAccumulateAction,
    }
)(UnconnectedReferenceArrayFieldController);

export default ReferenceArrayFieldController;
