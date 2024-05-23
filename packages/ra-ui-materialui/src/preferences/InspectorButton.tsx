import * as React from 'react';
import { MouseEventHandler } from 'react';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslate, usePreferencesEditor } from 'ra-core';

export const InspectorButton = React.forwardRef<
    HTMLButtonElement,
    Omit<
        IconButtonProps,
        'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'
    > & { label?: string; SvgIconProps?: any }
>(
    (
        {
            label = 'ra.configurable.configureMode',
            SvgIconProps = {},
            ...props
        },
        ref
    ) => {
        const { enable, disable, setPreferenceKey, isEnabled } =
            usePreferencesEditor();
        const translate = useTranslate();

        const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
            if (isEnabled) {
                disable();
                setPreferenceKey(null);
            } else {
                enable();
            }
        };

        const translatedLabel = translate(label, { _: 'Configure mode' });

        return (
            <Tooltip title={translatedLabel}>
                <IconButton
                    aria-label={translatedLabel}
                    onClick={handleClick}
                    color="inherit"
                    ref={ref}
                    {...props}
                >
                    <SettingsIcon fontSize="inherit" {...SvgIconProps} />
                </IconButton>
            </Tooltip>
        );
    }
);
