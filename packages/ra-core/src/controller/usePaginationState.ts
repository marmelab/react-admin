import { useState, useEffect } from 'react';
import { Pagination } from '../types';

interface PaginationProps {
    page: number;
    perPage: number;
    pagination: Pagination;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    setPagination: (pagination: Pagination) => void;
}

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
export default (initialPerPage: number = 25): PaginationProps => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(initialPerPage);

    const setPagination = (pagination: Pagination) => {
        setPage(pagination.page);
        setPerPage(pagination.perPage);
    };

    useEffect(() => setPerPage(initialPerPage), [initialPerPage]);

    return {
        page,
        perPage,
        pagination: {
            page,
            perPage,
        },
        setPage,
        setPerPage,
        setPagination,
    };
};
