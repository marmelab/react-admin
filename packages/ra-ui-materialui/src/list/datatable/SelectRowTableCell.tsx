import React, { useCallback } from 'react';
import { TableCell, Checkbox } from '@mui/material';
import { useTranslate, useRecordContext } from 'ra-core';

import { DataTableClasses } from './DataTableRoot';
import {
    useDataTableCallbacksContext,
    useDataTableSelectedIdsContext,
} from './context';

export const SelectRowTableCell = () => {
    const { handleToggleItem, isRowSelectable } =
        useDataTableCallbacksContext();
    const selectedIds = useDataTableSelectedIdsContext();
    const translate = useTranslate();
    const record = useRecordContext();
    if (!record) {
        throw new Error(
            'SelectRowTableCell can only be used within a RecordContext'
        );
    }

    const selectable = !isRowSelectable || isRowSelectable(record);
    const selected = selectedIds?.includes(record.id);

    const handleToggleSelection = useCallback(
        event => {
            if (!selectable || !handleToggleItem) return;
            handleToggleItem(record.id, event);
            event.stopPropagation();
        },
        [record.id, handleToggleItem, selectable]
    );

    return (
        <TableCell padding="checkbox">
            <Checkbox
                aria-label={translate('ra.action.select_row', {
                    _: 'Select this row',
                })}
                color="primary"
                className={`select-item ${DataTableClasses.checkbox}`}
                checked={selectable && selected}
                onClick={handleToggleSelection}
                disabled={!selectable}
            />
        </TableCell>
    );
};
