import React, { useCallback } from 'react';
import {
    useListContext,
    type RaRecord,
    type UseGetListOptions,
    type UseReferenceArrayFieldControllerParams,
    type UseReferenceManyFieldControllerParams,
} from 'ra-core';

import { Button, ButtonProps } from './Button';

/**
 * Select all items from a Datagrid.
 *
 * @typedef {Object} Props the props you can use
 * @prop {string} label Button label. Defaults to 'ra.action.select_all', translated.
 * @prop {string} limit Maximum number of items to select. Defaults to 250.
 * @prop {function} queryOptions Object of options passed to react-query.
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
        queryOptions,
        ...rest
    } = props;

    const { total, selectedIds, onSelectAll } = useListContext();
    const handleSelectAll = useCallback(
        event => {
            // @ts-ignore
            onSelectAll({ limit, queryOptions });
            if (onClick) onClick(event);
        },
        [onClick, onSelectAll, queryOptions, limit]
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

export type SelectAllButtonProps<RecordType extends RaRecord = any> =
    ButtonProps & {
        limit?: number;
        queryOptions?:
            | UseGetListOptions<RecordType>
            | UseReferenceArrayFieldControllerParams<RecordType>['queryOptions']
            | UseReferenceManyFieldControllerParams<RecordType>['queryOptions'];
    };
