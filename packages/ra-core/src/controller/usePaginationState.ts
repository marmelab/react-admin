import { useState, useEffect, useReducer, useMemo, useRef } from 'react';
import { Pagination } from '../types';

interface PaginationProps {
    page: number;
    perPage: number;
    pagination: Pagination;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    setPagination: (pagination: Pagination) => void;
}

const paginationReducer = (prevState, nextState) => {
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
 * set the sort to the given field, swap the order if the field is the same
 * @name setNumber
 * @function
 * @param {number} state the state value
 */

/**
 * @typedef PaginationProps
 * @type {Object}
 * @property {number} page: The page number.
 * @property {number} perPage: The number of item per page.
 * @property {setNumber} setPage: Set the page number
 * @property {setNumber} setPerPage: Set the per page number
 */

/**
 * Hooks to provide pagination state (apge and perPage)
 *
 * @example
 *
 * const { page, setpage, perPage, setPerPage } = usePagination(initialPerPage);
 *
 * @param {numper} initialPerPage the initial value per page
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

    const setPerPage = useMemo(() => perPage => setPagination({ perPage }), []);
    const setPage = useMemo(() => page => setPagination({ page }), []);

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
