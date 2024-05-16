import * as React from 'react';
import { memo, FC } from 'react';
import { styled } from '@mui/material/styles';
import { Pagination, PaginationProps } from '@mui/material';
import { useTranslate } from 'ra-core';

export const PaginationActions: FC<PaginationActionsProps> = memo(props => {
    const {
        page,
        rowsPerPage,
        count,
        onPageChange,
        size = 'small',
        className,
        ...rest
    } = props;
    const translate = useTranslate();

    const nbPages = Math.ceil(count / rowsPerPage) || 1;

    if (nbPages === 1) {
        return <Root className={className} />;
    }

    const getItemAriaLabel = (
        type: 'page' | 'first' | 'last' | 'next' | 'previous',
        page: number,
        selected: boolean
    ) => {
        if (type === 'page') {
            return selected
                ? translate('ra.navigation.current_page', {
                      page,
                      _: `page ${page}`,
                  })
                : translate('ra.navigation.page', {
                      page,
                      _: `Go to page ${page}`,
                  });
        }
        return translate(`ra.navigation.${type}`, { _: `Go to ${type} page` });
    };

    return (
        <Root className={className}>
            <Pagination
                size={size}
                count={nbPages}
                // <TablePagination>, the parent, uses 0-based pagination
                // while <Pagination> uses 1-based pagination
                page={page + 1}
                onChange={(e: any, page) => onPageChange(e, page - 1)}
                {...sanitizeRestProps(rest)}
                getItemAriaLabel={getItemAriaLabel}
            />
        </Root>
    );
});

export interface PaginationActionsProps extends PaginationProps {
    page: number;
    rowsPerPage: number;
    count: number;
    onPageChange: (event: MouseEvent, page: number) => void;
}

const PREFIX = 'RaPaginationActions';

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({
    flexShrink: 0,
    ml: 4,
}));

const sanitizeRestProps = ({
    nextIconButtonProps,
    backIconButtonProps,
    slotProps,
    ...rest
}: any) => rest;
