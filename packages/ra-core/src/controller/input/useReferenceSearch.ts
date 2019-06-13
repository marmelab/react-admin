import { useEffect } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import usePaginationState from '../usePaginationState';
import useSortState from '../useSortState';
import useFilterState, { Filter } from '../useFilterState';
import { crudGetMatchingAccumulate } from '../../actions/accumulateActions';
import {
    getPossibleReferences,
    getPossibleReferenceValues,
    getReferenceResource,
} from '../../reducer';

interface UseReferenceSearchOption {
    reference: string;
    referenceSource: (resource: string, source: string) => string;
    resource: string;
    source: string;
    permanentFilter: Filter;
    filterToQuery: (v: string) => Filter;
    perPage: number;
    filterValue: string;
}

export default ({
    reference,
    referenceSource,
    resource,
    source,
    permanentFilter,
    filterToQuery,
    perPage,
    filterValue,
}: UseReferenceSearchOption) => {
    const dispatch = useDispatch();

    const { pagination, setPagination } = usePaginationState(perPage);
    const { sort, setSort } = useSortState();
    const { filter, setFilter } = useFilterState({
        permanentFilter,
        filterToQuery,
    });

    useEffect(
        () =>
            fetchOptions({
                dispatch,
                filter,
                reference,
                referenceSource,
                resource,
                source,
                pagination,
                sort,
            }),
        [
            filter,
            reference,
            referenceSource,
            resource,
            source,
            pagination.page,
            pagination.perPage,
            sort.field,
            sort.order,
        ]
    );

    const matchingReferences = useSelector(
        getMatchingReferences({
            referenceSource,
            filterValue,
            reference,
            resource,
            source,
        }),
        [filterValue, referenceSource, reference, source, resource]
    );

    return {
        matchingReferences,
        setFilter,
        filter,
        pagination,
        setPagination,
        sort,
        setSort,
    };
};

const fetchOptions = ({
    dispatch,
    filter,
    reference,
    referenceSource,
    resource,
    source,
    pagination,
    sort,
}) => {
    dispatch(
        crudGetMatchingAccumulate(
            reference,
            referenceSource(resource, source),
            pagination,
            sort,
            filter
        )
    );
};

const matchingReferencesSelector = createSelector(
    [
        getReferenceResource,
        getPossibleReferenceValues,
        (_, props) => props.filterValue,
    ],
    (referenceState, possibleValues, inputId) =>
        getPossibleReferences(referenceState, possibleValues, [inputId])
);

const getMatchingReferences = props => state =>
    matchingReferencesSelector(state, props);
