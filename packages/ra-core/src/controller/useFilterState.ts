import { useState } from 'react';
import debounce from 'lodash/debounce';

export interface Filter {
    [k: string]: any;
}

interface UseFilterStateOptions {
    filterToQuery: (v: string) => Filter;
    initialFilter: Filter;
    debounceTime?: number;
}

interface UseFilterStateProps {
    filter: Filter;
    setFilter: (v: string) => void;
}

export default ({
    filterToQuery = v => ({ q: v }),
    initialFilter,
    debounceTime = 500,
}: UseFilterStateOptions): UseFilterStateProps => {
    const [filter, setFilterValue] = useState(initialFilter);

    const setFilter = debounce(
        value =>
            setFilterValue({
                ...initialFilter,
                ...filterToQuery(value),
            }),
        debounceTime
    );

    return {
        filter,
        setFilter,
    };
};
