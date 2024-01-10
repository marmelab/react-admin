import * as React from 'react';
import { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate, useExpandAll } from 'ra-core';
import { DatagridClasses } from './useDatagridStyles';
import clsx from 'clsx';

interface ExpandAllButtonProps {
    resource: string;
    ids: string[] | number[];
}

const ExpandAllButton = ({ resource, ids }: ExpandAllButtonProps) => {
    const translate = useTranslate();
    const [expanded, toggleExpanded] = useExpandAll(resource, ids);

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
            onClick={toggleExpanded}
            size="small"
        >
            <ExpandMoreIcon fontSize="inherit" />
        </IconButton>
    );
};

export default memo(ExpandAllButton);
