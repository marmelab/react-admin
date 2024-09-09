import * as React from 'react';
import { Alert } from '@mui/material';
import { useTranslate } from 'ra-core';

export const UnauthorizedReference = () => {
    const translate = useTranslate();
    return (
        <Alert severity="warning">
            {translate('ra.message.unauthorized_reference')}
        </Alert>
    );
};

export interface UnauthorizedReferenceProps {
    resource?: string;
}
