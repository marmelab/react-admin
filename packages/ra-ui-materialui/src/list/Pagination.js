import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { translate, sanitizeListRestProps } from 'ra-core';

import PaginationLimit from './PaginationLimit';
import Responsive from '../layout/Responsive';

const styles = theme => ({
    actions: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: 20,
    },
    caption: {
        flexShrink: 0,
    },
    spacer: {
        flex: '1 1 100%',
    },
    /* Styles applied to the Select component `root` class. */
    selectRoot: {
        marginRight: 32,
        marginLeft: 8,
        color: theme.palette.text.secondary,
    },
    /* Styles applied to the Select component `select` class. */
    select: {
        paddingLeft: 8,
        paddingRight: 16,
    },
    /* Styles applied to the Select component `icon` class. */
    selectIcon: {
        top: 1,
    },
    /* Styles applied to the Input component. */
    input: {
        fontSize: theme.typography.pxToRem(12),
        flexShrink: 0,
    },
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
});

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

    handlePerPageChange = event => {
        this.props.setPerPage(event.target.value);
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
                        size="small"
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
            ids,
            isLoading,
            page,
            perPage,
            rowsPerPageOptions,
            setPage,
            setPerPage,
            total,
            translate,
            ...rest
        } = this.props;

        if (!isLoading && (total === 0 || (ids && !ids.length))) {
            return <PaginationLimit total={total} page={page} ids={ids} />;
        }

        const offsetEnd = Math.min(page * perPage, total);
        const offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd);
        const nbPages = this.getNbPages();

        return (
            <Responsive
                small={
                    <Toolbar
                        className={className}
                        classes={{ root: classes.mobileToolbar }}
                        {...sanitizeListRestProps(rest)}
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
                        {...sanitizeListRestProps(rest)}
                    >
                        <div className={classes.spacer} />

                        <Typography
                            variant="caption"
                            className={classes.caption}
                        >
                            {translate('ra.navigation.page_rows_per_page')}
                        </Typography>
                        <Select
                            classes={{
                                root: classes.selectRoot,
                                select: classes.select,
                                icon: classes.selectIcon,
                            }}
                            input={
                                <Input
                                    className={classes.input}
                                    disableUnderline
                                />
                            }
                            value={perPage}
                            onChange={this.handlePerPageChange}
                        >
                            {rowsPerPageOptions.map(rowsPerPageOption => (
                                <MenuItem
                                    key={rowsPerPageOption}
                                    value={rowsPerPageOption}
                                >
                                    {rowsPerPageOption}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography
                            variant="caption"
                            className={classnames(
                                classes.caption,
                                'displayed-records'
                            )}
                        >
                            {translate('ra.navigation.page_range_info', {
                                offsetBegin,
                                offsetEnd,
                                total,
                            })}
                        </Typography>
                        <div className={classes.actions}>
                            {nbPages > 1 && [
                                page > 1 && (
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
                                ),
                                this.renderPageNums(),
                                page !== nbPages && (
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
                                ),
                            ]}
                        </div>
                    </Toolbar>
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
    translate,
    withStyles(styles)
);

export default enhance(Pagination);
