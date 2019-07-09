import { useState } from 'react';
import debounce from 'lodash/debounce';

export interface Filter {
    [k: string]: any;
}

interface UseFilterStateOptions {
    filterToQuery?: (v: string) => Filter;
    permanentFilter?: Filter;
    debounceTime?: number;
}

interface UseFilterStateProps {
    filter: Filter;
    setFilter: (v: string) => void;
}

/**
 * @name setFilter
 * @function
 * @param {string} the value
 */

/**
 * @typedef FilterProps
 * @type {Object}
 * @property {Object} filter: The filter object.
 * @property {setFilter} setFilter: Update the filter with the given string
 */

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
 * @param {Function} option.filterToQuery function to convert the filter string to a filter object
 * @param {Object} option.permanentFilter permanent filter to be merged with the filter string default to {}
 * @param {number} option.debounceTime Time between filter update allow to debounce the search
 *
 * @returns {FilterProps} The filter props
 */
export default ({
    filterToQuery = v => ({ q: v }),
    permanentFilter = {},
    debounceTime = 500,
}: UseFilterStateOptions): UseFilterStateProps => {
    const [filter, setFilterValue] = useState({
        ...permanentFilter,
        ...filterToQuery(''),
    });

    const setFilter = debounce(
        value =>
            setFilterValue({
                ...permanentFilter,
                ...filterToQuery(value),
            }),
        debounceTime
    );

    return {
        filter,
        setFilter,
    };
};
