import * as React from 'react';
import { ElementType, memo } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate, useExpandedMultiple } from 'ra-core';
import { DatagridClasses } from './useDatagridStyles';
import clsx from 'clsx';

interface ExpandAllButtonProps {
    resource: string;
    ids: string[] | number[];
}

const ExpandAllButton = ({ resource, ids }: ExpandAllButtonProps) => {
    const translate = useTranslate();
    const [expanded, toggleExpanded] = useExpandedMultiple(resource, ids);

    return (
        <IconButton
            className={clsx(DatagridClasses.expandIcon, {
                [DatagridClasses.expanded]: expanded,
            })}
            aria-label={translate(
                expanded ? 'ra.action.close' : 'ra.action.expand'
            )}
            aria-expanded={expanded}
            tabIndex={-1}
            aria-hidden="true"
            component="div"
            onClick={toggleExpanded}
            size="small"
        >
            <ExpandMoreIcon fontSize="inherit" />
        </IconButton>
    );
};

export default memo(ExpandAllButton);
