import * as React from 'react';
import { ElementType, memo } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate } from 'ra-core';

const ExpandRowButton = ({
    expanded,
    expandContentId,
    ...props
}: ExpandRowButtonProps) => {
    const translate = useTranslate();
    return (
        <IconButton
            aria-label={translate(
                expanded ? 'ra.action.close' : 'ra.action.expand'
            )}
            aria-expanded={expanded}
            aria-controls={expandContentId}
            tabIndex={-1}
            aria-hidden="true"
            component="div"
            {...props}
            size="small"
        >
            <ExpandMoreIcon fontSize="inherit" />
        </IconButton>
    );
};

export interface ExpandRowButtonProps extends IconButtonProps {
    component?: ElementType;
    expanded: boolean;
    expandContentId?: string;
}

export default memo(ExpandRowButton);
