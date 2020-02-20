import { useEffect, useReducer, useCallback, useRef } from 'react';
import { Pagination } from '../types';

/**
 * @typedef PaginationProps
 * @type {Object}
 * @property {number} page: The page number.
 * @property {number} perPage: The number of item per page.
 * @property {function} setPage: Set the page number
 * @property {function} setPerPage: Set the per page number
 * @property {function} setPagination: Set page and perPage pagination numbers
 */
interface PaginationProps {
    page: number;
    perPage: number;
    pagination: Pagination;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    setPagination: (pagination: Pagination) => void;
}

const paginationReducer = (
    prevState: Pagination,
    nextState: Partial<Pagination>
): Pagination => {
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
 * Hooks to provide pagination state (apge and perPage)
 *
 * @example
 *
 * const { page, setpage, perPage, setPerPage } = usePagination(initialPerPage);
 *
 * @param {number} initialPagination the initial value per page
 * @returns {PaginationProps} The pagination props
 */
export default (
    initialPagination: { perPage?: number; page?: number } = {}
): PaginationProps => {
    const [pagination, setPagination] = useReducer(paginationReducer, {
        ...defaultPagination,
        ...initialPagination,
    });
    const isFirstRender = useRef(true);

    const setPerPage = useCallback(perPage => setPagination({ perPage }), []);
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
