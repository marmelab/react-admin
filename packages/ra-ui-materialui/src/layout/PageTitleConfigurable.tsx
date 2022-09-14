import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { usePreferenceInput, usePreferenceKey } from 'ra-core';
import { TextField } from '@mui/material';

import { Configurable } from '../preferences';
import { PageTitle } from './PageTitle';

export const PageTitleEditor = () => {
    const preferenceKey = usePreferenceKey();
    const field = usePreferenceInput(preferenceKey, '');
    return (
        <form>
            <TextField
                label="title"
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                {...field}
            />
        </form>
    );
};

export const PageTitleConfigurable = ({ preferenceKey, ...props }) => {
    const { pathname } = useLocation();
    return (
        <Configurable
            editor={<PageTitleEditor />}
            preferenceKey={preferenceKey || `${pathname}.title`}
        >
            <PageTitle {...props} />
        </Configurable>
    );
};
