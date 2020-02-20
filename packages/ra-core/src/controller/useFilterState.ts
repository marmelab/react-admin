import { useEffect, useRef, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export interface Filter {
    [k: string]: any;
}

interface UseFilterStateOptions {
    filterToQuery?: (v: string) => Filter;
    permanentFilter?: Filter;
    debounceTime?: number;
}

/**
 * @typedef UseFilterStateProps
 * @property {Object} filter: The filter object.
 * @property {setFilter} setFilter: Update the filter with the given string
 */
interface UseFilterStateProps {
    filter: Filter;
    setFilter: (v: string) => void;
}

const defaultFilterToQuery = (v: string) => ({ q: v });
const emptyFilter = {};

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
 * // filter inital value:
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
    permanentFilter = emptyFilter,
    debounceTime = 500,
}: UseFilterStateOptions): UseFilterStateProps => {
    const permanentFilterProp = useRef(permanentFilter);
    const latestValue = useRef();
    const [filter, setFilterValue] = useState({
        ...permanentFilter,
        ...filterToQuery(''),
    });

    useEffect(() => {
        if (permanentFilterProp.current !== permanentFilter) {
            permanentFilterProp.current = permanentFilter;
            setFilterValue({
                ...permanentFilter,
                ...filterToQuery(latestValue.current),
            });
        }
    }, [permanentFilter, permanentFilterProp, filterToQuery]);

    const setFilter = useCallback(
        debounce(value => {
            setFilterValue({
                ...permanentFilter,
                ...filterToQuery(value),
            });
            latestValue.current = value;
        }, debounceTime),
        []
    );

    return {
        filter,
        setFilter,
    };
};
