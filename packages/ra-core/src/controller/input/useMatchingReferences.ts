import { useMemo } from 'react';
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
import { Pagination, Sort, Record } from '../../types';
import { useDeepCompareEffect } from '../../util/hooks';

interface UseMAtchingReferencesOption {
    reference: string;
    referenceSource: (resource: string, source: string) => string;
    resource: string;
    source: string;
    filter: Filter;
    pagination: Pagination;
    sort: Sort;
}

interface UseMatchingReferencesProps {
    error?: string;
    matchingReferences?: Record[];
    loading: boolean;
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
}: UseMAtchingReferencesOption): UseMatchingReferencesProps => {
    const dispatch = useDispatch();

    const getMatchingReferences = useMemo(makeMatchingReferencesSelector, []);

    const options = {
        dispatch,
        filter,
        reference,
        referenceSource,
        resource,
        source,
        pagination,
        sort,
    };

    useDeepCompareEffect(() => {
        fetchOptions({
            dispatch,
            filter,
            reference,
            referenceSource,
            resource,
            source,
            pagination,
            sort,
        });
    }, [
        dispatch,
        filter,
        reference,
        referenceSource,
        resource,
        source,
        pagination,
        sort,
    ]);

    const matchingReferences = useSelector(
        getMatchingReferences({
            referenceSource,
            filter,
            reference,
            resource,
            source,
        })
    );

    if (!matchingReferences) {
        return {
            loading: true,
            error: null,
            matchingReferences: null,
        };
    }

    if (matchingReferences.error) {
        return {
            loading: false,
            matchingReferences: null,
            error: matchingReferences.error,
        };
    }

    return {
        loading: false,
        error: null,
        matchingReferences,
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

const makeMatchingReferencesSelector = () => {
    const matchingReferencesSelector = createSelector(
        [
            getReferenceResource,
            getPossibleReferenceValues,
            (_, props) => props.filterValue,
        ],
        (referenceState, possibleValues, inputId) => {
            return getPossibleReferences(referenceState, possibleValues, [
                inputId,
            ]);
        }
    );

    return props => state => matchingReferencesSelector(state, props);
};
