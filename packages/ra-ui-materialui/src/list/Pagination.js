import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { translate } from 'ra-core';

import Responsive from '../layout/Responsive';

const styles = {
    pageInfo: {
        padding: '1.2em',
    },
    desktopToolbar: {
        justifyContent: 'flex-end',
    },
    mobileToolbar: {
        justifyContent: 'center',
    },
    hellip: { padding: '1.2em' },
};

export class Pagination extends Component {
    range() {
        const input = [];
        const { page, perPage, total } = this.props;
        if (isNaN(page)) return input;
        const nbPages = Math.ceil(total / perPage) || 1;

        // display page links around the current page
        if (page > 2) {
            input.push('1');
        }
        if (page === 4) {
            input.push('2');
        }
        if (page > 4) {
            input.push('.');
        }
        if (page > 1) {
            input.push(page - 1);
        }
        input.push(page);
        if (page < nbPages) {
            input.push(page + 1);
        }
        if (page === nbPages - 3) {
            input.push(nbPages - 1);
        }
        if (page < nbPages - 3) {
            input.push('.');
        }
        if (page < nbPages - 1) {
            input.push(nbPages);
        }

        return input;
    }

    getNbPages() {
        return Math.ceil(this.props.total / this.props.perPage) || 1;
    }

    prevPage = event => {
        event.stopPropagation();
        if (this.props.page === 1) {
            throw new Error(
                this.props.translate('ra.navigation.page_out_from_begin')
            );
        }
        this.props.setPage(this.props.page - 1);
    };

    nextPage = event => {
        event.stopPropagation();
        if (this.props.page > this.getNbPages()) {
            throw new Error(
                this.props.translate('ra.navigation.page_out_from_end')
            );
        }
        this.props.setPage(this.props.page + 1);
    };

    gotoPage = event => {
        event.stopPropagation();
        const page = event.currentTarget.dataset.page;
        if (page < 1 || page > this.getNbPages()) {
            throw new Error(
                this.props.translate('ra.navigation.page_out_of_boundaries', {
                    page,
                })
            );
        }
        this.props.setPage(page);
    };

    renderPageNums() {
        const { classes = {} } = this.props;

        return this.range().map(
            (pageNum, index) =>
                pageNum === '.' ? (
                    <span key={`hyphen_${index}`} className={classes.hellip}>
                        &hellip;
                    </span>
                ) : (
                    <Button
                        className={classnames('page-number', classes.button)}
                        color={
                            pageNum === this.props.page ? 'default' : 'primary'
                        }
                        key={pageNum}
                        data-page={pageNum}
                        onClick={this.gotoPage}
                    >
                        {pageNum}
                    </Button>
                )
        );
    }

    render() {
        const {
            classes = {},
            className,
            page,
            perPage,
            setPage,
            total,
            translate,
            ...rest
        } = this.props;
        if (total === 0) return null;
        const offsetEnd = Math.min(page * perPage, total);
        const offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd);
        const nbPages = this.getNbPages();

        return (
            <Responsive
                small={
                    <Toolbar
                        className={className}
                        classes={{ root: classes.mobileToolbar }}
                        {...rest}
                    >
                        {page > 1 && (
                            <IconButton color="primary" onClick={this.prevPage}>
                                <ChevronLeft />
                            </IconButton>
                        )}
                        <Typography
                            variant="body1"
                            className="displayed-records"
                        >
                            {translate('ra.navigation.page_range_info', {
                                offsetBegin,
                                offsetEnd,
                                total,
                            })}
                        </Typography>
                        {page !== nbPages && (
                            <IconButton color="primary" onClick={this.nextPage}>
                                <ChevronRight />
                            </IconButton>
                        )}
                    </Toolbar>
                }
                medium={
                    <Toolbar
                        className={classnames(
                            className,
                            classes.desktopToolbar
                        )}
                        {...rest}
                    >
                        <Typography
                            variant="body1"
                            className="displayed-records"
                        >
                            {translate('ra.navigation.page_range_info', {
                                offsetBegin,
                                offsetEnd,
                                total,
                            })}
                        </Typography>
                        {nbPages > 1 && [
                            page > 1 && (
                                <Button
                                    color="primary"
                                    key="prev"
                                    onClick={this.prevPage}
                                    className="previous-page"
                                >
                                    <ChevronLeft />
                                    {translate('ra.navigation.prev')}
                                </Button>
                            ),
                            this.renderPageNums(),
                            page !== nbPages && (
                                <Button
                                    color="primary"
                                    key="next"
                                    onClick={this.nextPage}
                                    className="next-page"
                                >
                                    {translate('ra.navigation.next')}
                                    <ChevronRight />
                                </Button>
                            ),
                        ]}
                    </Toolbar>
                }
            />
        );
    }
}

Pagination.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    page: PropTypes.number,
    perPage: PropTypes.number,
    setPage: PropTypes.func,
    translate: PropTypes.func.isRequired,
    total: PropTypes.number,
};

const enhance = compose(
    pure,
    translate,
    withStyles(styles)
);

export default enhance(Pagination);
