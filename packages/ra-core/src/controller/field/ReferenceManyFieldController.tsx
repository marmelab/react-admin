import { ReactNode, useState, useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyReference as crudGetManyReferenceAction } from '../../actions';
import {
    SORT_ASC,
    SORT_DESC,
} from '../../reducer/admin/resource/list/queryReducer';
import {
    getIds,
    getReferences,
    getTotal,
    nameRelatedTo,
} from '../../reducer/admin/references/oneToMany';
import { Record, Sort, RecordMap, Identifier, Dispatch } from '../../types';

interface ChildrenFuncParams {
    currentSort: Sort;
    data: RecordMap;
    ids: Identifier[];
    loadedOnce: boolean;
    page: number;
    perPage: number;
    referenceBasePath: string;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    setSort: (field: string) => void;
    total: number;
}

interface Props {
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    crudGetManyReference: Dispatch<typeof crudGetManyReferenceAction>;
    data?: RecordMap;
    filter?: any;
    ids?: any[];
    loadedOnce?: boolean;
    perPage?: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: Sort;
    source: string;
    target: string;
    total?: number;
}

const sortReducer = (state: Sort, field: string | Sort): Sort => {
    if (typeof field !== 'string') {
        return field;
    }
    const order =
        state.field === field && state.order === SORT_ASC
            ? SORT_DESC
            : SORT_ASC;
    return { field, order };
};

const defaultFilter = {};

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
 * By default, restricts the possible values to 25. You can extend this limit
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
export const UnconnectedReferenceManyFieldController = ({
    resource,
    reference,
    record,
    target,
    filter = defaultFilter,
    source,
    crudGetManyReference,
    data,
    ids,
    children,
    basePath,
    total,
    perPage = 25,
    sort = { field: 'id', order: 'DESC' },
}) => {
    const referenceId = get(record, source);
    const [page, setPage] = useState(1);
    const [currentPerPage, setPerPage] = useState(perPage);
    useEffect(() => setPerPage(perPage), [perPage]);
    const [currentSort, setSort] = useReducer(sortReducer, sort);
    useEffect(() => setSort(sort), [sort.field, sort.order]);

    useEffect(
        fetchReferences({
            reference,
            referenceId,
            resource,
            target,
            filter,
            source,
            crudGetManyReference,
            page,
            perPage: currentPerPage,
            sort: currentSort,
        }),
        [
            reference,
            referenceId,
            resource,
            target,
            filter,
            source,
            crudGetManyReference,
            page,
            currentPerPage,
            currentSort.field,
            currentSort.order,
        ]
    );

    const referenceBasePath = basePath.replace(resource, reference);

    return children({
        reference,
        record,
        resource,
        target,
        filter,
        source,
        sort,
        currentSort,
        data,
        ids,
        loadedOnce: typeof ids !== 'undefined',
        page,
        perPage: currentPerPage,
        referenceBasePath,
        setPage,
        setPerPage,
        setSort,
        total,
    });
};

const fetchReferences = ({
    reference,
    referenceId,
    resource,
    target,
    filter,
    source,
    crudGetManyReference,
    page,
    perPage,
    sort,
}) => () => {
    const relatedTo = nameRelatedTo(
        reference,
        referenceId,
        resource,
        target,
        filter
    );

    crudGetManyReference(
        reference,
        target,
        referenceId,
        relatedTo,
        { page, perPage },
        sort,
        filter,
        source
    );
};

function mapStateToProps(state, props) {
    const relatedTo = nameRelatedTo(
        props.reference,
        get(props.record, props.source),
        props.resource,
        props.target,
        props.filter
    );
    return {
        data: getReferences(state, props.reference, relatedTo),
        ids: getIds(state, relatedTo),
        total: getTotal(state, relatedTo),
    };
}

const ReferenceManyFieldController = connect(
    mapStateToProps,
    {
        crudGetManyReference: crudGetManyReferenceAction,
    }
)(UnconnectedReferenceManyFieldController);

export default ReferenceManyFieldController;
