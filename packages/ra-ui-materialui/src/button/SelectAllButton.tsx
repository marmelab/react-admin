import * as React from 'react';
import {
    type GetListParams,
    type GetManyReferenceParams,
    type RaRecord,
    useListContext,
    useSelectAll,
} from 'ra-core';
import type { UseMutationOptions } from '@tanstack/react-query';
import { Button, ButtonProps } from './Button';
import { useCallback } from 'react';

/**
 * Select All button for list forms
 *
 * @typedef {Object} Props the props you can use
 * @prop {string} label Button label. Defaults to 'ra.action.select_all', translated.
 * @prop {string} limit Maximum number of items to select. Defaults to 250.
 * @prop {function} mutationOptions Object of options passed to react-query.
 *
 * @param {Props} props
 *
 * @example // with custom success side effect
 *
 * const MySelectAllButton = () => {
 *     const notify = useNotify();
 *     const onSuccess = (response) => {
 *         notify('All items selected!', { type: 'info' });
 *     };
 *     return <SelectAllButton limit={100} mutationOptions={{ onSuccess }} />;
 * }
 */

export const SelectAllButton = (props: SelectAllButtonProps) => {
    const {
        label = 'ra.action.select_all',
        limit = 250,
        mutationOptions,
        ...rest
    } = props;

    const { filter, sort, meta, total, selectedIds } = useListContext();
    const onSelectAll = useSelectAll({ limit, filter, sort, meta });
    const handleSelectAll = useCallback(() => {
        onSelectAll();
    }, [onSelectAll]);

    if (total === selectedIds.length || selectedIds.length >= limit)
        return null;

    return (
        <Button
            label={label}
            onClick={handleSelectAll}
            type="button"
            {...rest}
        />
    );
};

export type SelectAllButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> = ButtonProps & {
    limit?: number;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        GetManyReferenceParams | GetListParams
    >;
};
