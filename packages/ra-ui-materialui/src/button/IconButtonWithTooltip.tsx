import * as React from 'react';
import { MouseEvent } from 'react';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { useTranslate } from 'ra-core';

/**
 * An IconButton with a tooltip which ensures the tooltip is closed on click to avoid ghost tooltips
 * when the button position changes.
 */
export const IconButtonWithTooltip = ({
    label,
    onClick,
    ...props
}: IconButtonWithTooltipProps) => {
    const translate = useTranslate();
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const translatedLabel = translate(label, { _: label });

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        handleClose();
        onClick(event);
    };

    return (
        <Tooltip
            title={translatedLabel}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
        >
            <IconButton
                aria-label={translatedLabel}
                onClick={handleClick}
                {...props}
            />
        </Tooltip>
    );
};

export interface IconButtonWithTooltipProps extends IconButtonProps {
    label: string;
}
