import * as React from 'react';
import { useCallback } from 'react';
import {
    useDataTableCallbacksContext,
    useDataTableDataContext,
    useDataTableSelectedIdsContext,
    useTranslate,
} from 'ra-core';
import { Checkbox } from '@mui/material';

export const SelectPageCheckbox = () => {
    const data = useDataTableDataContext();
    const { isRowSelectable, onSelect } = useDataTableCallbacksContext();
    const selectedIds = useDataTableSelectedIdsContext();

    const translate = useTranslate();

    const handleSelectAll = useCallback(
        event => {
            if (!onSelect || !selectedIds || !data) return;
            onSelect(
                event.target.checked
                    ? selectedIds.concat(
                          data
                              .filter(
                                  record => !selectedIds.includes(record.id)
                              )
                              .filter(record =>
                                  isRowSelectable
                                      ? isRowSelectable(record)
                                      : true
                              )
                              .map(record => record.id)
                      )
                    : []
            );
        },
        [data, onSelect, isRowSelectable, selectedIds]
    );

    const selectableIds = Array.isArray(data)
        ? isRowSelectable
            ? data
                  .filter(record => isRowSelectable(record))
                  .map(record => record.id)
            : data.map(record => record.id)
        : [];

    return (
        <Checkbox
            inputProps={{
                'aria-label': translate('ra.action.select_all', {
                    _: 'Select all',
                }),
            }}
            className="select-all"
            color="primary"
            checked={
                selectedIds &&
                selectedIds.length > 0 &&
                selectableIds.length > 0 &&
                selectableIds.every(id => selectedIds.includes(id))
            }
            onChange={handleSelectAll}
            onClick={e => e.stopPropagation()}
        />
    );
};
