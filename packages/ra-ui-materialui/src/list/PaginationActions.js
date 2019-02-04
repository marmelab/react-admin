import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import compose from 'recompose/compose';
import { translate } from 'ra-core';

const styles = theme => ({
    actions: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: 20,
    },
    hellip: { padding: '1.2em' },
});

export class PaginationActions extends Component {
    /**
     * Warning: material-ui's page is 0-based
     */
    range() {
        const { page, rowsPerPage, count } = this.props;
        const nbPages = Math.ceil(count / rowsPerPage) || 1;
        if (isNaN(page) || nbPages === 1) {
            return [];
        }
        const input = [];
        // display page links around the current page
        if (page > 1) {
            input.push(1);
        }
        if (page === 3) {
            input.push(2);
        }
        if (page > 3) {
            input.push('.');
        }
        if (page > 0) {
            input.push(page);
        }
        input.push(page + 1);
        if (page < nbPages - 1) {
            input.push(page + 2);
        }
        if (page === nbPages - 4) {
            input.push(nbPages - 1);
        }
        if (page < nbPages - 4) {
            input.push('.');
        }
        if (page < nbPages - 2) {
            input.push(nbPages);
        }

        return input;
    }

    getNbPages = () =>
        Math.ceil(this.props.count / this.props.rowsPerPage) || 1;

    prevPage = event => {
        if (this.props.page === 0) {
            throw new Error(
                this.props.translate('ra.navigation.page_out_from_begin')
            );
        }
        this.props.onChangePage(event, this.props.page - 1);
    };

    nextPage = event => {
        if (this.props.page > this.getNbPages() - 1) {
            throw new Error(
                this.props.translate('ra.navigation.page_out_from_end')
            );
        }
        this.props.onChangePage(event, this.props.page + 1);
    };

    gotoPage = event => {
        const page = parseInt(event.currentTarget.dataset.page, 10);
        if (page < 0 || page > this.getNbPages() - 1) {
            throw new Error(
                this.props.translate('ra.navigation.page_out_of_boundaries', {
                    page: page + 1,
                })
            );
        }
        this.props.onChangePage(event, page);
    };

    renderPageNums() {
        const { classes = {} } = this.props;

        return this.range().map((pageNum, index) =>
            pageNum === '.' ? (
                <span key={`hyphen_${index}`} className={classes.hellip}>
                    &hellip;
                </span>
            ) : (
                <Button
                    className="page-number"
                    color={
                        pageNum === this.props.page + 1 ? 'default' : 'primary'
                    }
                    key={pageNum}
                    data-page={pageNum - 1}
                    onClick={this.gotoPage}
                    size="small"
                >
                    {pageNum}
                </Button>
            )
        );
    }

    render() {
        const { classes = {}, page, translate } = this.props;

        const nbPages = this.getNbPages();
        if (nbPages === 1) return <div className={classes.actions} />;
        return (
            <div className={classes.actions}>
                {page > 0 && (
                    <Button
                        color="primary"
                        key="prev"
                        onClick={this.prevPage}
                        className="previous-page"
                        size="small"
                    >
                        <ChevronLeft />
                        {translate('ra.navigation.prev')}
                    </Button>
                )}
                {this.renderPageNums()}
                {page !== nbPages - 1 && (
                    <Button
                        color="primary"
                        key="next"
                        onClick={this.nextPage}
                        className="next-page"
                        size="small"
                    >
                        {translate('ra.navigation.next')}
                        <ChevronRight />
                    </Button>
                )}
            </div>
        );
    }
}

/**
 * PaginationActions propTypes are copied over from material-ui’s
 * TablePaginationActions propTypes. See
 * https://github.com/mui-org/material-ui/blob/869692ecf3812bc4577ed4dde81a9911c5949695/packages/material-ui/src/TablePaginationActions/TablePaginationActions.js#L53-L85
 * for reference.
 */
PaginationActions.propTypes = {
    backIconButtonProps: PropTypes.object,
    count: PropTypes.number.isRequired,
    nextIconButtonProps: PropTypes.object,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const enhance = compose(
    pure,
    translate,
    withStyles(styles)
);

export default enhance(PaginationActions);
