import * as React from 'react';
import { usePreference, useSetInspectorTitle, useTranslate } from 'ra-core';
import { Box, Button } from '@mui/material';

import { FieldEditor } from './FieldEditor';

export const DatagridEditor = (props: {
    children: React.ReactNode;
    omit?: string[];
}) => {
    const translate = useTranslate();
    useSetInspectorTitle('ra.inspector.datagrid', { _: 'Datagrid' });

    const [availableColumns] = usePreference('availableColumns', []);

    const [columns, setColumns] = usePreference(
        'columns',
        availableColumns
            .map(column => column.source)
            .filter(name => !props.omit?.includes(name))
    );

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

    const handleHideAll = () => {
        setColumns([]);
    };
    const handleShowAll = () => {
        setColumns(availableColumns.map(column => column.source));
    };
    return (
        <div>
            {availableColumns.map(column => (
                <FieldEditor
                    source={column.source}
                    label={column.label}
                    selected={columns.includes(column.source)}
                    onToggle={handleToggle}
                />
            ))}
            <Box display="flex" justifyContent="space-between" mx={-0.5} mt={1}>
                <Button size="small" onClick={handleHideAll}>
                    {translate('ra.inspector.datagrid.hideAll', {
                        _: 'Hide All',
                    })}
                </Button>
                <Button size="small" onClick={handleShowAll}>
                    {translate('ra.inspector.datagrid.showAll', {
                        _: 'Show All',
                    })}
                </Button>
            </Box>
        </div>
    );
};
