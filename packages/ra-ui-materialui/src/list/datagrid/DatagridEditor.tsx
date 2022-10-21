import * as React from 'react';
import { usePreference, useSetInspectorTitle, useTranslate } from 'ra-core';
import { Box, Button } from '@mui/material';

import { ConfigurableDatagridColumn } from './DatagridConfigurable';
import { FieldEditor } from './FieldEditor';

export const DatagridEditor = () => {
    const translate = useTranslate();
    useSetInspectorTitle('ra.inspector.datagrid', { _: 'Datagrid' });

    const [availableColumns] = usePreference<ConfigurableDatagridColumn[]>(
        'availableColumns',
        []
    );
    const [omit] = usePreference('omit', []);

    const [columns, setColumns] = usePreference(
        'columns',
        availableColumns
            .filter(column => !omit?.includes(column.source))
            .map(column => column.index)
    );

    const handleToggle = event => {
        if (event.target.checked) {
            // add the column at the right position
            setColumns(
                availableColumns
                    .filter(
                        column =>
                            column.index === event.target.name ||
                            columns.includes(column.index)
                    )
                    .map(column => column.index)
            );
        } else {
            setColumns(columns.filter(index => index !== event.target.name));
        }
    };

    const handleHideAll = () => {
        setColumns([]);
    };
    const handleShowAll = () => {
        setColumns(availableColumns.map(column => column.index));
    };
    return (
        <div>
            {availableColumns.map(column => (
                <FieldEditor
                    key={column.index}
                    source={column.source}
                    label={column.label}
                    index={column.index}
                    selected={columns.includes(column.index)}
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
