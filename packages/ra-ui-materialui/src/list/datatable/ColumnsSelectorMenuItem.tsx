import * as React from 'react';
import { useResourceContext, useStore, useTranslateLabel } from 'ra-core';
import { Checkbox, MenuItem } from '@mui/material';

import { DataTableColumnProps } from './DataTableColumn';
import { useDataTableStoreContext } from './context';

export const ColumnsSelectorMenuItem = ({
    source,
    label,
}: DataTableColumnProps) => {
    const resource = useResourceContext();
    const { storeKey, defaultHiddenColumns } = useDataTableStoreContext();
    const [hiddenColumns, setHiddenColumns] = useStore<string[]>(
        storeKey,
        defaultHiddenColumns
    );
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
