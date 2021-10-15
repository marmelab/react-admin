import * as React from 'react';
import { ElementType, memo } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import classNames from 'classnames';
import { useTranslate } from 'ra-core';

const ExpandRowButton = ({
    classes,
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
            className={classNames(classes.expandIcon, {
                [classes.expanded]: expanded,
            })}
            tabIndex={-1}
            aria-hidden="true"
            component="div"
            {...props}
            size="large"
        >
            <ExpandMoreIcon />
        </IconButton>
    );
};

export interface ExpandRowButtonProps extends IconButtonProps {
    classes?: any;
    component?: ElementType;
    expanded: boolean;
    expandContentId?: string;
}

export default memo(ExpandRowButton);
