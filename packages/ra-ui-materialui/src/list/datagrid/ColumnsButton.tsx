import * as React from 'react';
import { useStore, useTranslate, useResourceContext } from 'ra-core';
import { Box, Button, Popover } from '@mui/material';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

import { FieldEditor } from './FieldEditor';

export const ColumnsButton = props => {
    const resource = useResourceContext(props);
    const preferenceKey =
        props.preferenceKey || `preferences.${resource}.datagrid`;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [availableColumns] = useStore<{ source: string; label?: string }[]>(
        `${preferenceKey}.availableColumns`,
        []
    );
    const [columns, setColumns] = useStore<string[]>(
        `${preferenceKey}.columns`,
        availableColumns.map(column => column.source)
    );
    const translate = useTranslate();

    const handleClick = (event): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const handleToggle = event => {
        if (event.target.checked) {
            // add the column at the right position
            setColumns(
                availableColumns
                    .filter(
                        column =>
                            column.source === event.target.name ||
                            columns.includes(column.source)
                    )
                    .map(column => column.source)
            );
        } else {
            setColumns(columns.filter(name => name !== event.target.name));
        }
    };

    return (
        <>
            <Button
                size="small"
                onClick={handleClick}
                startIcon={<ViewWeekIcon />}
                sx={{ '&.MuiButton-sizeSmall': { lineHeight: 1.5 } }}
            >
                {translate('ra.action.columns', { _: 'Columns' })}
            </Button>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box p={1}>
                    {availableColumns.map(column => (
                        <FieldEditor
                            source={column.source}
                            label={column.label}
                            selected={columns.includes(column.source)}
                            onToggle={handleToggle}
                        />
                    ))}
                </Box>
            </Popover>
        </>
    );
};

export interface ColumnsButtonProps {
    preferenceKey: string;
}
