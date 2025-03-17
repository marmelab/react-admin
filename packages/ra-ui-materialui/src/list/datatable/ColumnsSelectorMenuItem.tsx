import * as React from 'react';
import { useResourceContext, useStore, useTranslateLabel } from 'ra-core';
import { Checkbox, MenuItem } from '@mui/material';

import { useDataTableContext } from './DataTableContext';
import { DataTableColumnProps } from './DataTableColumn';

export const ColumnsSelectorMenuItem = ({
    source,
    label,
}: DataTableColumnProps) => {
    const resource = useResourceContext();
    const { storeKey } = useDataTableContext();
    const [hiddenColumns, setHiddenColumns] = useStore<string[]>(storeKey, []);
    const translateLabel = useTranslateLabel();
    if (!source && !label) return null;
    const fieldLabel = translateLabel({
        label: typeof label === 'string' ? label : undefined,
        resource,
        source,
    });
    const isColumnHidden = hiddenColumns.includes(source!);
    return (
        <MenuItem
            onClick={() =>
                isColumnHidden
                    ? setHiddenColumns(
                          hiddenColumns.filter(column => column !== source!)
                      )
                    : setHiddenColumns([...hiddenColumns, source!])
            }
        >
            <Checkbox
                sx={{ padding: '0 0.5em 0 0' }}
                size="small"
                checked={!isColumnHidden}
            />
            {fieldLabel}
        </MenuItem>
    );
};
