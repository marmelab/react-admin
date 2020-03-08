import React from 'react';
import pure from 'recompose/pure';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useTranslate } from 'ra-core';

const PaginationLimit = () => {
    const translate = useTranslate();
    return (
        <CardContent>
            <Typography variant="body2">
                {translate('ra.navigation.no_results')}
            </Typography>
        </CardContent>
    );
};

export default pure(PaginationLimit);
