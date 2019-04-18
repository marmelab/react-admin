import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import TablePagination from '@material-ui/core/TablePagination';
import compose from 'recompose/compose';
import { translate, sanitizeListRestProps } from 'ra-core';

import PaginationActions from './PaginationActions';
import PaginationLimit from './PaginationLimit';
import Responsive from '../layout/Responsive';

const emptyArray = [];

export class Pagination extends Component {
    getNbPages = () => Math.ceil(this.props.total / this.props.perPage) || 1;

    componentDidUpdate() {
        if (this.props.page < 1 || isNaN(this.props.page)) {
            this.props.setPage(1);
        }
    }

    /**
     * Warning: material-ui's page is 0-based
     */
    handlePageChange = (event, page) => {
        event && event.stopPropagation();
        if (page < 0 || page > this.getNbPages() - 1) {
            throw new Error(
                this.props.translate('ra.navigation.page_out_of_boundaries', {
                    page: page + 1,
                })
            );
        }
        this.props.setPage(page + 1);
    };

    handlePerPageChange = event => {
        this.props.setPerPage(event.target.value);
    };

    labelDisplayedRows = ({ from, to, count }) => {
        const { translate } = this.props;
        return translate('ra.navigation.page_range_info', {
            offsetBegin: from,
            offsetEnd: to,
            total: count,
        });
    };

    render() {
        const {
            width, // used for testing responsive
            isLoading,
            page,
            perPage,
            rowsPerPageOptions,
            total,
            translate,
            ...rest
        } = this.props;

        if (!isLoading && total === 0) {
            return <PaginationLimit />;
        }

        return (
            <Responsive
                width={width}
                small={
                    <TablePagination
                        count={total}
                        rowsPerPage={perPage}
                        page={page - 1}
                        onChangePage={this.handlePageChange}
                        rowsPerPageOptions={emptyArray}
                        component="span"
                        labelDisplayedRows={this.labelDisplayedRows}
                        {...sanitizeListRestProps(rest)}
                    />
                }
                medium={
                    <TablePagination
                        count={total}
                        rowsPerPage={perPage}
                        page={page - 1}
                        onChangePage={this.handlePageChange}
                        onChangeRowsPerPage={this.handlePerPageChange}
                        ActionsComponent={PaginationActions}
                        component="span"
                        labelRowsPerPage={translate(
                            'ra.navigation.page_rows_per_page'
                        )}
                        labelDisplayedRows={this.labelDisplayedRows}
                        rowsPerPageOptions={rowsPerPageOptions}
                        {...sanitizeListRestProps(rest)}
                    />
                }
            />
        );
    }
}

Pagination.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    ids: PropTypes.array,
    isLoading: PropTypes.bool,
    page: PropTypes.number,
    perPage: PropTypes.number,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    setPage: PropTypes.func,
    setPerPage: PropTypes.func,
    translate: PropTypes.func.isRequired,
    total: PropTypes.number,
};

Pagination.defaultProps = {
    rowsPerPageOptions: [5, 10, 25],
};

const enhance = compose(
    pure,
    translate
);

export default enhance(Pagination);
