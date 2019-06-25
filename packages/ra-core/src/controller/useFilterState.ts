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
