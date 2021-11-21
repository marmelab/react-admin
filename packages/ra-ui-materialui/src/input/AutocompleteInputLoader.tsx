import React from 'react';
import { CircularProgress } from '@mui/material';
import { useTimeout } from 'ra-core';

export const AutocompleteInputLoader = ({ timeout = 1000 }) => {
    const oneSecondHasPassed = useTimeout(timeout);

    if (oneSecondHasPassed) {
        return <CircularProgress size={24} />;
    }

    return null;
};
