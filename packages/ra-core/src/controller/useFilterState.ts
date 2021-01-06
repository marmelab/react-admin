import { useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

import { useSafeSetState } from '../util';
import { FilterPayload } from '../types';

interface UseFilterStateOptions {
    filterToQuery?: (v: string) => FilterPayload;
    permanentFilter?: FilterPayload;
    debounceTime?: number;
}

/**
 * @typedef UseFilterStateProps
 * @property {Object} filter: The filter object.
 * @property {setFilter} setFilter: Update the filter with the given string
 */
interface UseFilterStateProps {
    filter: FilterPayload;
    setFilter: (v: string) => void;
}

const defaultFilterToQuery = (v: string) => ({ q: v });

/**
 * Hooks to provide filter state and setFilter which update the query part of the filter
 *
 * @example
 *
 * const { filter, setFilter } = useFilter({
 *      filterToQuery: v => ({ query: v }),
 *      permanentFilter: { foo: 'bar' },
 *      debounceTime: 500,
 * });
 * // filter initial value:
 * {
 *      query: '',
 *      foo: 'bar'
 * }
 *  // after updating filter
 *  setFilter('needle');
 *  {
 *      query: 'needle',
 *      foo: 'bar'
 *  }
 *
 * @param {Object} option
 * @param {Function} option.filterToQuery Function to convert the filter string to a filter object. Defaults to v => ({ q: v }).
 * @param {Object} option.permanentFilter Permanent filter to be merged with the filter string. Defaults to {}.
 * @param {number} option.debounceTime Time in ms between filter updates - used to debounce the search. Defaults to 500ms.
 *
 * @returns {UseFilterStateOptions} The filter props
 */
export default ({
    filterToQuery = defaultFilterToQuery,
    permanentFilter = {},
    debounceTime = 500,
}: UseFilterStateOptions): UseFilterStateProps => {
    const permanentFilterProp = useRef(permanentFilter);
    const latestValue = useRef<string>();
    const [filter, setFilterValue] = useSafeSetState({
        ...permanentFilter,
        ...filterToQuery(''),
    });
    // Developers often pass an object literal as permanent filter
    // e.g. <ReferenceInput source="book_id" reference="books" filter={{ is_published: true }}>
    // The effect should execute again when the parent component updates the filter value,
    // but not when the object literal describes the same values. Therefore,
    // we use JSON.stringify(permanentFilter) in the `useEffect` and `useCallback`
    // dependencies instead of permanentFilter.
    const permanentFilterSignature = JSON.stringify(permanentFilter);

    useEffect(() => {
        if (!isEqual(permanentFilterProp.current, permanentFilter)) {
            permanentFilterProp.current = permanentFilter;
            setFilterValue({
                ...permanentFilter,
                ...filterToQuery(latestValue.current),
            });
        }
    }, [permanentFilterSignature, permanentFilterProp, filterToQuery]); // eslint-disable-line react-hooks/exhaustive-deps

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setFilter = useCallback(
        debounce((value: string) => {
            setFilterValue({
                ...permanentFilter,
                ...filterToQuery(value),
            });
            latestValue.current = value;
        }, debounceTime),
        [permanentFilterSignature] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return {
        filter,
        setFilter,
    };
};
