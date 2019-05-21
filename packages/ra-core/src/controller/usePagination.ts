import { useState, useEffect } from 'react';

interface PaginationProps {
    page: number;
    perPage: number;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
}

export default (initialPerPage: number = 25): PaginationProps => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(initialPerPage);
    useEffect(() => setPerPage(initialPerPage), [initialPerPage]);

    return {
        page,
        perPage,
        setPage,
        setPerPage,
    };
};
