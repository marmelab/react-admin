import * as React from 'react';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { useListPaginationContext, useTranslate } from 'ra-core';

export const PartialPaginationActions = React.forwardRef(
    function PartialPaginationActions(props: any, ref) {
        const {
            backIconButtonProps,
            count,
            getItemAriaLabel,
            nextIconButtonProps,
            onPageChange,
            page,
            rowsPerPage,
            showLastButton,
            showFirstButton,
            ...other
        } = props;

        const theme = useTheme();
        const translate = useTranslate();
        const { hasPreviousPage, hasNextPage } = useListPaginationContext();

        const handleBackButtonClick = event => {
            onPageChange(event, page - 1);
        };

        const handleNextButtonClick = event => {
            onPageChange(event, page + 1);
        };

        const previousLabel = translate('ra.navigation.previous', {
            _: 'Go to previous page',
        });
        const nextLabel = translate('ra.navigation.next', {
            _: 'Go to next page',
        });

        return (
            <div ref={ref} {...other}>
                <IconButton
                    onClick={handleBackButtonClick}
                    disabled={!hasPreviousPage}
                    color="inherit"
                    aria-label={previousLabel}
                    title={previousLabel}
                    {...backIconButtonProps}
                >
                    {theme.direction === 'rtl' ? (
                        <KeyboardArrowRight />
                    ) : (
                        <KeyboardArrowLeft />
                    )}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={!hasNextPage}
                    color="inherit"
                    aria-label={nextLabel}
                    title={nextLabel}
                    {...nextIconButtonProps}
                >
                    {theme.direction === 'rtl' ? (
                        <KeyboardArrowLeft />
                    ) : (
                        <KeyboardArrowRight />
                    )}
                </IconButton>
            </div>
        );
    }
);
