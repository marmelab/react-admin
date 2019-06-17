import { useEffect } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { Filter } from '../useFilterState';
import { crudGetMatchingAccumulate } from '../../actions/accumulateActions';
import {
    getPossibleReferences,
    getPossibleReferenceValues,
    getReferenceResource,
} from '../../reducer';
import { Pagination, Sort } from '../../types';

interface UseReferenceSearchOption {
    reference: string;
    referenceSource: (resource: string, source: string) => string;
    resource: string;
    source: string;
    filter: Filter;
    pagination: Pagination;
    sort: Sort;
}

const defaultReferenceSource = (resource: string, source: string) =>
    `${resource}@${source}`;

export default ({
    reference,
    referenceSource = defaultReferenceSource,
    resource,
    source,
    filter,
    pagination,
    sort,
}: UseReferenceSearchOption) => {
    const dispatch = useDispatch();

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
            filter,
            reference,
            resource,
            source,
        }),
        [filter, referenceSource, reference, source, resource]
    );

    return matchingReferences;
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
    (referenceState, possibleValues, inputId) => {
        return getPossibleReferences(referenceState, possibleValues, [inputId]);
    }
);

const getMatchingReferences = props => state =>
    matchingReferencesSelector(state, props);
