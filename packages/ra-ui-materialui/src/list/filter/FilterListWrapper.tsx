import * as React from 'react';
import { ReactNode } from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslate } from 'ra-core';

export const FilterListWrapper = (props: FilterListWrapperProps) => {
    const { label, icon, children, ...rest } = props;
    const translate = useTranslate();
    return (
        <Box {...rest}>
            <Box mt={2} display="flex" alignItems="center">
                <Box mr={1} lineHeight="initial">
                    {icon}
                </Box>
                <Typography variant="overline">
                    {translate(label, { _: label })}
                </Typography>
            </Box>
            {children}
        </Box>
    );
};

export interface FilterListWrapperProps extends BoxProps {
    label: string;
    icon: ReactNode;
}
