import React, { useCallback, memo } from 'react';
import { Checkbox } from '@mui/material';
import {
    useDataTableSelectedIdsContext,
    useDataTableCallbacksContext,
    useTranslate,
    useRecordContext,
} from 'ra-core';

import { DataTableClasses } from './DataTableRoot';

export const SelectRowCheckbox = memo(() => {
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
    );
});

SelectRowCheckbox.displayName = 'SelectRowTableCell';
