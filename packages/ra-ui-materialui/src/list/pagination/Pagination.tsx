import * as React from 'react';
import { useCallback, useMemo, FC, memo, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    TablePagination,
    TablePaginationBaseProps,
    Toolbar,
    useMediaQuery,
    Theme,
} from '@mui/material';
import {
    useTranslate,
    useListPaginationContext,
    sanitizeListRestProps,
    ComponentPropType,
} from 'ra-core';

import { PaginationActions } from './PaginationActions';
import { PaginationLimit } from './PaginationLimit';

export const Pagination: FC<PaginationProps> = memo(props => {
    const {
        rowsPerPageOptions = DefaultRowsPerPageOptions,
        actions = PaginationActions,
        limit = DefaultLimit,
        ...rest
    } = props;
    const {
        isLoading,
        page,
        perPage,
        total,
        setPage,
        setPerPage,
    } = useListPaginationContext(props);
    const translate = useTranslate();
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('md')
    );

    const totalPages = useMemo(() => {
        return Math.ceil(total / perPage) || 1;
    }, [perPage, total]);

    /**
     * Warning: material-ui's page is 0-based
     */
    const handlePageChange = useCallback(
        (event, page) => {
            event && event.stopPropagation();
            if (page < 0 || page > totalPages - 1) {
                throw new Error(
                    translate('ra.navigation.page_out_of_boundaries', {
                        page: page + 1,
                    })
                );
            }
            setPage(page + 1);
        },
        [totalPages, setPage, translate]
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

    // Avoid rendering TablePagination if "page" value is invalid
    if (total === null || total === 0 || page < 1 || page > totalPages) {
        return isLoading ? <Toolbar variant="dense" /> : limit;
    }

    if (isSmall) {
        return (
            <TablePagination
                count={total}
                rowsPerPage={perPage}
                page={page - 1}
                onPageChange={handlePageChange}
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
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePerPageChange}
            ActionsComponent={actions}
            component="span"
            labelRowsPerPage={translate('ra.navigation.page_rows_per_page')}
            labelDisplayedRows={labelDisplayedRows}
            rowsPerPageOptions={rowsPerPageOptions}
            {...sanitizeListRestProps(rest)}
        />
    );
});

Pagination.propTypes = {
    actions: ComponentPropType,
    limit: PropTypes.element,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};

const DefaultLimit = <PaginationLimit />;
const DefaultRowsPerPageOptions = [5, 10, 25];
const emptyArray = [];

export interface PaginationProps extends TablePaginationBaseProps {
    rowsPerPageOptions?: number[];
    actions?: FC;
    limit?: ReactElement;
}
