import React, { useCallback } from 'react';
import { useListContext, useSelectAll } from 'ra-core';

import { Button, ButtonProps } from './Button';

/**
 * Select all items from a Datagrid.
 *
 * @typedef {Object} Props the props you can use
 * @prop {string} label Button label. Defaults to 'ra.action.select_all', translated.
 * @prop {string} limit Maximum number of items to select. Defaults to 250.
 *
 * @param {Props} props
 *
 * @example
 *
 * const MySelectAllButton = () => <SelectAllButton limit={100} label="Select all books" />;
 */

const PREFIX = 'RaSelectAllButton';

export const SelectAllButton = (props: SelectAllButtonProps) => {
    const {
        label = 'ra.action.select_all',
        limit = 250,
        onClick,
        ...rest
    } = props;

    const { filter, sort, meta, total, selectedIds } = useListContext();
    const onSelectAll = useSelectAll({ limit, filter, sort, meta });
    const handleSelectAll = useCallback(
        event => {
            onSelectAll();
            if (onClick) onClick(event);
        },
        [onClick, onSelectAll]
    );

    if (total === selectedIds.length || selectedIds.length >= limit)
        return null;

    return (
        <Button
            label={label}
            onClick={handleSelectAll}
            type="button"
            name={PREFIX}
            {...rest}
        />
    );
};

export type SelectAllButtonProps = ButtonProps & {
    limit?: number;
};
