import { ReactNode, useState, useReducer, useEffect, useMemo } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyReference } from '../../actions';
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
    currentPerPage: number;
    referenceBasePath: string;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    setSort: (field: string) => void;
    total: number;
}

interface Options {
    basePath: string;
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

const useReferenceMany = ({
    resource,
    reference,
    record,
    target,
    filter = defaultFilter,
    source,
    basePath,
    perPage = 25,
    sort = { field: 'id', order: 'DESC' },
}: Options): ChildrenFuncParams => {
    const referenceId = get(record, source);
    const relatedTo = useMemo(
        () => nameRelatedTo(reference, referenceId, resource, target, filter),
        [filter, reference, referenceId, resource, target]
    );
    const ids = useSelector(selectIds(relatedTo), [relatedTo]);
    const data = useSelector(selectData(reference, relatedTo), [
        reference,
        relatedTo,
    ]);
    const total = useSelector(selectTotal(relatedTo), [relatedTo]);
    const [page, setPage] = useState(1);
    const [currentPerPage, setPerPage] = useState(perPage);
    useEffect(() => setPerPage(perPage), [perPage]);
    const [currentSort, setSort] = useReducer(sortReducer, sort);
    useEffect(() => setSort(sort), [sort.field, sort.order]);

    const dispatch = useDispatch();

    useEffect(
        fetchReferences({
            reference,
            referenceId,
            resource,
            target,
            filter,
            source,
            page,
            perPage: currentPerPage,
            sort: currentSort,
            dispatch,
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

    return {
        currentSort,
        data,
        ids,
        loadedOnce: typeof ids !== 'undefined',
        page,
        currentPerPage,
        referenceBasePath,
        setPage,
        setPerPage,
        setSort,
        total,
    };
};

const fetchReferences = ({
    reference,
    referenceId,
    resource,
    target,
    filter,
    source,
    dispatch,
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

    dispatch(
        crudGetManyReference(
            reference,
            target,
            referenceId,
            relatedTo,
            { page, perPage },
            sort,
            filter,
            source
        )
    );
};

const selectData = (reference, relatedTo) => state =>
    getReferences(state, reference, relatedTo);

const selectIds = relatedTo => state => getIds(state, relatedTo);
const selectTotal = relatedTo => state => getTotal(state, relatedTo);

export default useReferenceMany;
