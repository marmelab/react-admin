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
    ListPaginationContextValue,
} from 'ra-core';

import { PaginationActions } from './PaginationActions';

export const Pagination: FC<PaginationProps> = memo(props => {
    const {
        rowsPerPageOptions = DefaultRowsPerPageOptions,
        actions,
        limit = null,
        ...rest
    } = props;
    const {
        isLoading,
        hasNextPage,
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
        return total != null ? Math.ceil(total / perPage) : undefined;
    }, [perPage, total]);

    /**
     * Warning: Material UI's page is 0-based
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
            count === -1 && hasNextPage
                ? translate('ra.navigation.partial_page_range_info', {
                      offsetBegin: from,
                      offsetEnd: to,
                      _: `%{from}-%{to} of more than %{to}`,
                  })
                : translate('ra.navigation.page_range_info', {
                      offsetBegin: from,
                      offsetEnd: to,
                      total: count === -1 ? to : count,
                      _: `%{from}-%{to} of %{count === -1 ? to : count}`,
                  }),
        [translate, hasNextPage]
    );

    const labelItem = useCallback(
        type => translate(`ra.navigation.${type}`, { _: `Go to ${type} page` }),
        [translate]
    );

    if (isLoading) {
        return <Toolbar variant="dense" />;
    }

    // Avoid rendering TablePagination if "page" value is invalid
    if (total === 0 || page < 1 || (total != null && page > totalPages)) {
        if (limit != null && process.env.NODE_ENV === 'development') {
            console.warn(
                'The Pagination limit prop is deprecated. Empty state should be handled by the component displaying data (Datagrid, SimpleList).'
            );
        }
        return null;
    }

    if (isSmall) {
        return (
            <TablePagination
                count={total == null ? -1 : total}
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

    const ActionsComponent = actions
        ? actions // overridden by caller
        : !isLoading && total != null
        ? PaginationActions // regular navigation
        : undefined; // partial navigation (uses default TablePaginationActions)

    return (
        <TablePagination
            count={total == null ? -1 : total}
            rowsPerPage={perPage}
            page={page - 1}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePerPageChange}
            // @ts-ignore
            ActionsComponent={ActionsComponent}
            nextIconButtonProps={{
                disabled: !hasNextPage,
            }}
            component="span"
            labelRowsPerPage={translate('ra.navigation.page_rows_per_page')}
            labelDisplayedRows={labelDisplayedRows}
            getItemAriaLabel={labelItem}
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

const DefaultRowsPerPageOptions = [5, 10, 25, 50];
const emptyArray = [];

export interface PaginationProps
    extends TablePaginationBaseProps,
        Partial<ListPaginationContextValue> {
    rowsPerPageOptions?: number[];
    actions?: FC;
    limit?: ReactElement;
}
