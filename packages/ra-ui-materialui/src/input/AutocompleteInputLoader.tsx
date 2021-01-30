import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { useTimeout } from 'ra-core';

export const AutocompleteInputLoader = ({ timeout = 1000 }) => {
    const oneSecondHasPassed = useTimeout(timeout);

    if (oneSecondHasPassed) {
        return <CircularProgress size={24} />;
    }

    return null;
};
