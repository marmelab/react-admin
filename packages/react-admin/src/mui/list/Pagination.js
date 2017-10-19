import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import ChevronRight from 'material-ui-icons/ChevronRight';
import Toolbar from 'material-ui/Toolbar';
import Hidden from 'material-ui/Hidden';
import { withTheme } from 'material-ui/styles';
import compose from 'recompose/compose';
import translate from '../../i18n/translate';

const styles = {
    button: {
        margin: '10px 0',
    },
    pageInfo: {
        padding: '1.2em',
    },
    mobileToolbar: {
        margin: 'auto',
    },
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
        return this.range().map(
            (pageNum, index) =>
                pageNum === '.' ? (
                    <span key={`hyphen_${index}`} style={{ padding: '1.2em' }}>
                        &hellip;
                    </span>
                ) : (
                    <Button
                        className="page-number"
                        color={
                            pageNum === this.props.page ? 'accent' : 'primary'
                        }
                        key={pageNum}
                        data-page={pageNum}
                        onClick={this.gotoPage}
                        style={styles.button}
                    >
                        {pageNum}
                    </Button>
                )
        );
    }

    render() {
        const { theme, page, perPage, total, translate } = this.props;
        if (total === 0) return null;
        const offsetEnd = Math.min(page * perPage, total);
        const offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd);
        const nbPages = this.getNbPages();

        return [
            <Hidden mdUp key="mobile">
                <Toolbar>
                    <div style={styles.mobileToolbar}>
                        {page > 1 && (
                            <IconButton onClick={this.prevPage}>
                                <ChevronLeft
                                    color={theme.palette.primary1Color}
                                />
                            </IconButton>
                        )}
                        <span style={styles.pageInfo}>
                            {translate('ra.navigation.page_range_info', {
                                offsetBegin,
                                offsetEnd,
                                total,
                            })}
                        </span>
                        {page !== nbPages && (
                            <IconButton onClick={this.nextPage}>
                                <ChevronRight
                                    color={theme.palette.primary1Color}
                                />
                            </IconButton>
                        )}
                    </div>
                </Toolbar>
            </Hidden>,
            <Hidden mdDown key="desktop">
                <Toolbar>
                    <div>
                        <span
                            className="displayed-records"
                            style={styles.pageInfo}
                        >
                            {translate('ra.navigation.page_range_info', {
                                offsetBegin,
                                offsetEnd,
                                total,
                            })}
                        </span>
                    </div>
                    {nbPages > 1 && (
                        <div>
                            {page > 1 && (
                                <Button
                                    className="previous-page"
                                    color="primary"
                                    key="prev"
                                    onClick={this.prevPage}
                                    style={styles.button}
                                >
                                    <ChevronLeft />
                                    {translate('ra.navigation.prev')}
                                </Button>
                            )}
                            {this.renderPageNums()}
                            {page !== nbPages && (
                                <Button
                                    className="next-page"
                                    color="primary"
                                    key="next"
                                    onClick={this.nextPage}
                                    style={styles.button}
                                >
                                    {translate('ra.navigation.next')}
                                    <ChevronRight />
                                </Button>
                            )}
                        </div>
                    )}
                </Toolbar>
            </Hidden>,
        ];
    }
}

Pagination.propTypes = {
    theme: PropTypes.object.isRequired,
    page: PropTypes.number,
    perPage: PropTypes.number,
    setPage: PropTypes.func,
    translate: PropTypes.func.isRequired,
    total: PropTypes.number,
};

const enhance = compose(pure, translate, withTheme());

export default enhance(Pagination);
