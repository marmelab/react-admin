import * as React from 'react';
import { Typography } from '@mui/material';
import { useTranslate, useSetInspectorTitle } from 'ra-core';

export const InspectorRoot = () => {
    const translate = useTranslate();
    useSetInspectorTitle('ra.configurable.inspector.title', {
        _: 'Inspector',
    });

    return (
        <Typography>
            {translate('ra.configurable.inspector.content', {
                _: 'Hover the application UI elements to configure them',
            })}
        </Typography>
    );
};
