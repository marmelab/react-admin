import { useReducer, useCallback, useState } from 'react';
import { PaginationPayload } from '../types';

/**
 * @typedef PaginationProps
 * @type {Object}
 * @property {number} page: The page number.
 * @property {number} perPage: The number of item per page.
 * @property {Function} setPage: Set the page number
 * @property {Function} setPerPage: Set the per page number
 * @property {Function} setPagination: Set page and perPage pagination numbers
 */
export interface PaginationHookResult {
    page: number;
    perPage: number;
    pagination: PaginationPayload;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    setPagination: (pagination: PaginationPayload) => void;
}

const paginationReducer = (
    prevState: PaginationPayload,
    nextState: Partial<PaginationPayload>
): PaginationPayload => {
    return {
        ...prevState,
        ...nextState,
    };
};

const defaultPagination = {
    page: 1,
    perPage: 25,
};

/**
 * Hooks to provide pagination state (page and perPage)
 *
 * @example
 *
 * const { page, setPage, perPage, setPerPage } = usePagination(initialPerPage);
 *
 * @param {number} initialPagination the initial value per page
 * @returns {PaginationHookResult} The pagination props
 */
export default (
    initialPagination: { perPage?: number; page?: number } = {}
): PaginationHookResult => {
    const [pagination, setPagination] = useReducer(paginationReducer, {
        ...defaultPagination,
        ...initialPagination,
    });
    const setPerPage = useCallback(
        perPage => setPagination({ perPage, page: 1 }),
        []
    );
    const setPage = useCallback(page => setPagination({ page }), []);

    const [prevPerPage, setPrevPerPage] = useState(initialPagination.perPage);
    // Updating the state during render (and not in an effect) lets React
    // restart the render before committing it, so that children never see
    // the previous perPage.
    // @see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
    if (initialPagination.perPage !== prevPerPage) {
        setPrevPerPage(initialPagination.perPage);
        setPerPage(initialPagination.perPage || 25);
    }

    return {
        page: pagination.page,
        perPage: pagination.perPage,
        pagination,
        setPage,
        setPerPage,
        setPagination,
    };
};
