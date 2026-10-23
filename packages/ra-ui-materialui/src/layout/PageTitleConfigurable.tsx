import * as React from 'react';
import {
    usePreferenceInput,
    usePreference,
    useRecordContext,
    useTranslate,
    useLocation,
} from 'ra-core';
import { TextField } from '@mui/material';

import { Configurable } from '../preferences';
import { DocumentTitle, PageTitle } from './PageTitle';

export const PageTitleEditor = () => {
    const field = usePreferenceInput('', '');
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

export const PageTitleConfigurable = ({
    preferenceKey,
    title,
    defaultTitle,
    ...props
}) => {
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
            <PageTitleConfigurableInner
                title={title}
                defaultTitle={defaultTitle}
                {...props}
            />
        </Configurable>
    );
};

const PageTitleConfigurableInner = ({ title, defaultTitle, ...props }) => {
    const [titleFromPreferences] = usePreference();
    const translate = useTranslate();
    const record = useRecordContext();

    if (typeof titleFromPreferences !== 'string') {
        return (
            <PageTitle title={title} defaultTitle={defaultTitle} {...props} />
        );
    }

    const pageTitle = translate(titleFromPreferences, {
        ...record,
        _: titleFromPreferences,
    });
    return (
        <span className={props.className} {...props}>
            {pageTitle}
            <DocumentTitle title={pageTitle} />
        </span>
    );
};
