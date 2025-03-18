import * as React from 'react';
import { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate, useExpandAll, useResourceContext } from 'ra-core';
import { DatagridClasses } from './useDatagridStyles';
import clsx from 'clsx';

interface ExpandAllButtonProps {
    ids: string[] | number[];
    classes?: Record<string, string>;
}

const ExpandAllButton = ({
    ids,
    classes = DatagridClasses,
}: ExpandAllButtonProps) => {
    const translate = useTranslate();
    const resource = useResourceContext();
    const [expanded, toggleExpanded] = useExpandAll(resource || '', ids);

    if (!resource) return null;
    return (
        <IconButton
            className={clsx(classes.expandIcon, {
                [classes.expanded]: expanded,
            })}
            aria-label={translate(
                expanded ? 'ra.action.close' : 'ra.action.expand'
            )}
            aria-expanded={expanded}
            tabIndex={-1}
            aria-hidden="true"
            onClick={toggleExpanded}
            size="small"
        >
            <ExpandMoreIcon fontSize="inherit" />
        </IconButton>
    );
};

export default memo(ExpandAllButton);
