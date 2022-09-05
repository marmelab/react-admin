import * as React from 'react';
import { MouseEventHandler } from 'react';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslate, usePreferencesEditor } from 'ra-core';

export const InspectorButton = ({
    label = 'inspector.action.show',
    ...props
}: IconButtonProps & { label?: string }) => {
    const { enable, disable, isEnabled } = usePreferencesEditor();
    const translate = useTranslate();

    const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
        isEnabled ? disable() : enable();
    };

    const translatedLabel = translate(label);

    return (
        <Tooltip title={translatedLabel}>
            <IconButton
                aria-label={translatedLabel}
                onClick={handleClick}
                color="inherit"
                {...props}
            >
                <SettingsIcon fontSize="inherit" />
            </IconButton>
        </Tooltip>
    );
};
