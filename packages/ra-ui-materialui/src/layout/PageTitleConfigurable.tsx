import * as React from 'react';
import { useLocation } from 'react-router-dom';
import {
    usePreferenceInput,
    usePreference,
    useRecordContext,
    useTranslate,
} from 'ra-core';
import { TextField } from '@mui/material';

import { Configurable } from '../preferences';
import { PageTitle } from './PageTitle';

export const PageTitleEditor = () => {
    const field = usePreferenceInput();
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
            sx={{
                '&.RaConfigurable-editMode': {
                    margin: '2px',
                },
            }}
        >
            <PageTitleConfigurableInner {...props} />
        </Configurable>
    );
};

const PageTitleConfigurableInner = props => {
    const [titleFromPreferences] = usePreference();
    const translate = useTranslate();
    const record = useRecordContext();

    return titleFromPreferences ? (
        <span className={props.className}>
            {translate(titleFromPreferences, {
                ...record,
                _: titleFromPreferences,
            })}
        </span>
    ) : (
        <PageTitle {...props} />
    );
};
