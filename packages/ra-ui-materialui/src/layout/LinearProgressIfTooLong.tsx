import { useTimeout } from 'ra-core';
import * as React from 'react';
import LinearProgress from './LinearProgress';

export const LinearProgressIfTooLong = ({ timeout = 1000, ...props }) => {
    const oneSecondHasPassed = useTimeout(timeout);

    return oneSecondHasPassed ? <LinearProgress {...props} /> : null;
};
