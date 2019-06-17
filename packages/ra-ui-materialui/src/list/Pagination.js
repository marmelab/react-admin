import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import { useTranslate, sanitizeListRestProps } from 'ra-core';

import PaginationActions from './PaginationActions';
import PaginationLimit from './PaginationLimit';
import { useMediaIsSmall } from '../layout/mediaQueries';

const emptyArray = [];

const Pagination = ({
    isLoading,
    page,
    perPage,
    rowsPerPageOptions,
    total,
    setPage,
    setPerPage,
    ...rest
}) => {
    useEffect(() => {
        if (page < 1 || isNaN(page)) {
            setPage(1);
        }
    }, [page, setPage]);
    const translate = useTranslate();
    const isSmall = useMediaIsSmall();

    const getNbPages = () => Math.ceil(total / perPage) || 1;

    /**
     * Warning: material-ui's page is 0-based
     */
    const handlePageChange = useCallback(
        (event, page) => {
            event && event.stopPropagation();
            if (page < 0 || page > getNbPages() - 1) {
                throw new Error(
                    translate('ra.navigation.page_out_of_boundaries', {
                        page: page + 1,
                    })
                );
            }
            setPage(page + 1);
        },
        [total, perPage, setPage, translate] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const handlePerPageChange = useCallback(
        event => {
            setPerPage(event.target.value);
        },
        [setPerPage]
    );

    const labelDisplayedRows = useCallback(
        ({ from, to, count }) =>
            translate('ra.navigation.page_range_info', {
                offsetBegin: from,
                offsetEnd: to,
                total: count,
            }),
        [translate]
    );

    if (total === 0) {
        return isLoading ? <Toolbar variant="dense" /> : <PaginationLimit />;
    }
    if (isSmall) {
        return (
            <TablePagination
                count={total}
                rowsPerPage={perPage}
                page={page - 1}
                onChangePage={handlePageChange}
                rowsPerPageOptions={emptyArray}
                component="span"
                labelDisplayedRows={labelDisplayedRows}
                {...sanitizeListRestProps(rest)}
            />
        );
    }
    return (
        <TablePagination
            count={total}
            rowsPerPage={perPage}
            page={page - 1}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerPageChange}
            ActionsComponent={PaginationActions}
            component="span"
            labelRowsPerPage={translate('ra.navigation.page_rows_per_page')}
            labelDisplayedRows={labelDisplayedRows}
            rowsPerPageOptions={rowsPerPageOptions}
            {...sanitizeListRestProps(rest)}
        />
    );
};

Pagination.propTypes = {
    ids: PropTypes.array,
    isLoading: PropTypes.bool,
    page: PropTypes.number,
    perPage: PropTypes.number,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    setPage: PropTypes.func,
    setPerPage: PropTypes.func,
    total: PropTypes.number,
};

Pagination.defaultProps = {
    rowsPerPageOptions: [5, 10, 25],
};

export default React.memo(Pagination);
