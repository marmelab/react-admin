import * as React from 'react';
import { memo, FC } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useTranslate } from 'ra-core';
import classnames from 'classnames';

export const PaginationActions: FC<PaginationActionsProps> = memo(props => {
    const { page, rowsPerPage, count, onPageChange, color, size } = props;

    const translate = useTranslate();
    const theme = useTheme();
    /**
     * Warning: material-ui's page is 0-based
     */
    const range = () => {
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
    };

    const getNbPages = () => Math.ceil(count / rowsPerPage) || 1;

    const prevPage = event => {
        if (page === 0) {
            throw new Error(translate('ra.navigation.page_out_from_begin'));
        }
        onPageChange(event, page - 1);
    };

    const nextPage = event => {
        if (page > getNbPages() - 1) {
            throw new Error(translate('ra.navigation.page_out_from_end'));
        }
        onPageChange(event, page + 1);
    };

    const gotoPage = event => {
        const page = parseInt(event.currentTarget.dataset.page, 10);
        if (page < 0 || page > getNbPages() - 1) {
            throw new Error(
                translate('ra.navigation.page_out_of_boundaries', {
                    page: page + 1,
                })
            );
        }
        onPageChange(event, page);
    };

    const renderPageNums = () => {
        return range().map((pageNum, index) =>
            pageNum === '.' ? (
                <span
                    key={`hyphen_${index}`}
                    className={PaginationActionsClasses.hellip}
                >
                    &hellip;
                </span>
            ) : (
                <Button
                    size={size}
                    className={classnames(
                        'page-number',
                        PaginationActionsClasses.button,
                        {
                            [PaginationActionsClasses.currentPageButton]:
                                pageNum === page + 1,
                        }
                    )}
                    color={color}
                    variant={pageNum === page + 1 ? 'outlined' : 'text'}
                    key={pageNum}
                    data-page={pageNum - 1}
                    onClick={gotoPage}
                >
                    {pageNum}
                </Button>
            )
        );
    };

    const nbPages = getNbPages();

    if (nbPages === 1) {
        return <Root className={PaginationActionsClasses.actions} />;
    }

    return (
        <Root className={PaginationActionsClasses.actions}>
            {page > 0 && (
                <Button
                    color={color}
                    size={size}
                    key="prev"
                    onClick={prevPage}
                    className="previous-page"
                >
                    {theme.direction === 'rtl' ? (
                        <ChevronRight />
                    ) : (
                        <ChevronLeft />
                    )}
                    {translate('ra.navigation.prev')}
                </Button>
            )}
            {renderPageNums()}
            {page !== nbPages - 1 && (
                <Button
                    color={color}
                    size={size}
                    key="next"
                    onClick={nextPage}
                    className="next-page"
                >
                    {translate('ra.navigation.next')}
                    {theme.direction === 'rtl' ? (
                        <ChevronLeft />
                    ) : (
                        <ChevronRight />
                    )}
                </Button>
            )}
        </Root>
    );
});

export interface PaginationActionsProps {
    page: number;
    rowsPerPage: number;
    count: number;
    onPageChange: (event: MouseEvent, page: number) => void;
    color:
        | 'inherit'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'error'
        | 'info'
        | 'warning';
    size: 'small' | 'medium' | 'large';
}
/**
 * PaginationActions propTypes are copied over from material-ui’s
 * TablePaginationActions propTypes. See
 * https://github.com/mui-org/material-ui/blob/869692ecf3812bc4577ed4dde81a9911c5949695/packages/material-ui/src/TablePaginationActions/TablePaginationActions.js#L53-L85
 * for reference.
 */
PaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    color: PropTypes.oneOf(['primary', 'secondary']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
};

PaginationActions.defaultProps = {
    color: 'primary',
    size: 'small',
};

const PREFIX = 'RaPaginationActions';

export const PaginationActionsClasses = {
    actions: `${PREFIX}-actions`,
    button: `${PREFIX}-button`,
    currentPageButton: `${PREFIX}-currentPageButton`,
    hellip: `${PREFIX}-hellip`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${PaginationActionsClasses.actions}`]: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: 20,
    },

    [`& .${PaginationActionsClasses.button}`]: {},
    [`& .${PaginationActionsClasses.currentPageButton}`]: {},
    [`& .${PaginationActionsClasses.hellip}`]: { padding: '1.2em' },
}));
