import * as React from 'react';
import { useEffect, useCallback, FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    TablePagination,
    TablePaginationBaseProps,
    Toolbar,
    useMediaQuery,
    Theme,
} from '@material-ui/core';
import {
    useTranslate,
    useListContext,
    sanitizeListRestProps,
    ComponentPropType,
} from 'ra-core';

import DefaultPaginationActions from './PaginationActions';
import DefaultPaginationLimit from './PaginationLimit';

const emptyArray = [];

const Pagination: FC<PaginationProps> = props => {
    const { rowsPerPageOptions, actions, limit, ...rest } = props;
    const {
        loading,
        page,
        perPage,
        total,
        setPage,
        setPerPage,
    } = useListContext(props);
    useEffect(() => {
        if (page < 1 || isNaN(page)) {
            setPage(1);
        }
    }, [page, setPage]);
    const translate = useTranslate();
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );

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
        return loading ? <Toolbar variant="dense" /> : limit;
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
            ActionsComponent={actions}
            component="span"
            labelRowsPerPage={translate('ra.navigation.page_rows_per_page')}
            labelDisplayedRows={labelDisplayedRows}
            rowsPerPageOptions={rowsPerPageOptions}
            {...sanitizeListRestProps(rest)}
        />
    );
};

Pagination.propTypes = {
    actions: ComponentPropType,
    limit: PropTypes.element,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};

Pagination.defaultProps = {
    actions: DefaultPaginationActions,
    limit: <DefaultPaginationLimit />,
    rowsPerPageOptions: [5, 10, 25],
};

export interface PaginationProps extends TablePaginationBaseProps {
    rowsPerPageOptions?: number[];
    actions?: FC;
    limit?: ReactElement;
}

export default React.memo(Pagination);
