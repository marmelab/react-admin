import { useEffect, useMemo } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyReference } from '../../actions';
import {
    getIds,
    getReferences,
    getTotal,
    nameRelatedTo,
} from '../../reducer/admin/references/oneToMany';
import { Record, Sort, RecordMap, Identifier, Dispatch } from '../../types';

interface ChildrenFuncParams {
    data: RecordMap;
    ids: Identifier[];
    loadedOnce: boolean;
    referenceBasePath: string;
    total: number;
}

interface Options {
    basePath: string;
    data?: RecordMap;
    filter?: any;
    ids?: any[];
    loadedOnce?: boolean;
    page: number;
    perPage: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: Sort;
    source: string;
    target: string;
    total?: number;
}

const defaultFilter = {};

const useReferenceMany = ({
    resource,
    reference,
    record,
    target,
    filter = defaultFilter,
    source,
    basePath,
    page,
    perPage,
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
            perPage,
            sort,
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
            perPage,
            sort.field,
            sort.order,
        ]
    );

    const referenceBasePath = basePath.replace(resource, reference);

    return {
        data,
        ids,
        loadedOnce: typeof ids !== 'undefined',
        referenceBasePath,
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
