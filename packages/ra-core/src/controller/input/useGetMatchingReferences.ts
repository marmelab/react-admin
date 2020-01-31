import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Filter } from '../useFilterState';
import { crudGetMatchingAccumulate } from '../../actions/accumulateActions';
import {
    getPossibleReferences,
    getPossibleReferenceValues,
    getReferenceResource,
} from '../../reducer';
import { Pagination, Sort, Record } from '../../types';
import { useDeepCompareEffect } from '../../util/hooks';

interface UseMatchingReferencesOption {
    reference: string;
    referenceSource: (resource: string, source: string) => string;
    resource: string;
    source: string;
    filter: Filter;
    pagination: Pagination;
    sort: Sort;
    id: string;
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
    id,
}: UseMatchingReferencesOption): UseMatchingReferencesProps => {
    const dispatch = useDispatch();

    useDeepCompareEffect(() => {
        dispatch(
            crudGetMatchingAccumulate(
                reference,
                referenceSource(resource, source),
                pagination,
                sort,
                filter
            )
        );
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

    const matchingReferences = useGetMatchingReferenceSelector({
        referenceSource,
        reference,
        resource,
        source,
        id,
    });

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

const useGetMatchingReferenceSelector = ({
    referenceSource,
    reference,
    resource,
    source,
    id,
}) => {
    const getMatchingReferences = useCallback(
        state => {
            const referenceResource = getReferenceResource(state, {
                reference,
            });
            const possibleValues = getPossibleReferenceValues(state, {
                referenceSource,
                resource,
                source,
            });

            return getPossibleReferences(referenceResource, possibleValues, [
                id,
            ]);
        },
        [referenceSource, reference, resource, source, id]
    );

    return useSelector(getMatchingReferences);
};
