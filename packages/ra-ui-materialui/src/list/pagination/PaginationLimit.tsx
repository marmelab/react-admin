import * as React from 'react';
import { memo } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTranslate } from 'ra-core';

export const PaginationLimit = memo(
    ({ message = 'ra.navigation.no_results' }: PaginationLimitProps) => {
        const translate = useTranslate();

        return (
            <CardContent>
                <Typography variant="body2">{translate(message)}</Typography>
            </CardContent>
        );
    }
);

export interface PaginationLimitProps {
    message?: string;
}
