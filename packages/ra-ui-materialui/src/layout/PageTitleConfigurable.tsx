import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { usePreferenceInput } from 'ra-core';
import { TextField } from '@mui/material';

import { Configurable, ResetSettingsButton } from '../preferences';
import { PageTitle } from './PageTitle';

export const PageTitleEditor = ({ preferenceKey }: any) => {
    const { pathname } = useLocation();
    const key = `preferences.${preferenceKey || pathname}.title`;
    const field = usePreferenceInput(key, '');
    return (
        <>
            <TextField
                label="title"
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                {...field}
            />
            <ResetSettingsButton preferenceKeys={[key]} />
        </>
    );
};

export const PageTitleConfigurable = ({ preferenceKey, ...props }) => (
    <Configurable editor={<PageTitleEditor />} preferenceKey={preferenceKey}>
        <PageTitle {...props} />
    </Configurable>
);
