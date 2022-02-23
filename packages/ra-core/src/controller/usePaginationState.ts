import { useEffect, useReducer, useCallback, useRef } from 'react';
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
    const isFirstRender = useRef(true);

    const setPerPage = useCallback(
        perPage => setPagination({ perPage, page: 1 }),
        []
    );
    const setPage = useCallback(page => setPagination({ page }), []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setPerPage(initialPagination.perPage || 25);
    }, [initialPagination.perPage, setPerPage]);

    return {
        page: pagination.page,
        perPage: pagination.perPage,
        pagination,
        setPage,
        setPerPage,
        setPagination,
    };
};
