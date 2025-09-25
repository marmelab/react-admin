import React, { useCallback } from 'react';
import { useListContext } from 'ra-core';
import {
    type RaRecord,
    type UseGetListOptions,
    type UseReferenceArrayFieldControllerParams,
    type UseReferenceManyFieldControllerParams,
} from 'ra-core';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';

import { Button, type ButtonProps } from './Button';

/**
 * Select all items in the current List context.
 *
 * Used in Datagrid's bulk action toolbar.
 *
 * @typedef {Object} Props the props you can use
 * @prop {string} label Button label. Defaults to 'ra.action.select_all_button', translated.
 * @prop {string} limit Maximum number of items to select. Defaults to 250.
 * @prop {function} queryOptions Object of options passed to react-query.
 *
 * @param {Props} props
 *
 * @example
 *
 * import { List, Datagrid, BulkActionsToolbar, SelectAllButton, BulkDeleteButton } from 'react-admin';
 *
 * const PostSelectAllButton = () => (
 *     <SelectAllButton
 *         label="Select all records"
 *         queryOptions={{ meta: { foo: 'bar' } }}
 *     />
 * );
 *
 * export const PostList = () => (
 *     <List>
 *         <Datagrid
 *             bulkActionsToolbar={
 *                 <BulkActionsToolbar selectAllButton={<PostSelectAllButton />}>
 *                     <BulkDeleteButton />
 *                 </BulkActionsToolbar>
 *             }
 *         >
 *             ...
 *         </Datagrid>
 *     </List>
 * );
 */
export const SelectAllButton = (inProps: SelectAllButtonProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        label = 'ra.action.select_all_button',
        limit = 250,
        onClick,
        queryOptions,
        ...rest
    } = props;

    const { total, selectedIds, onSelectAll, data } = useListContext();
    const handleClick = useCallback(
        event => {
            onSelectAll({ limit, queryOptions });
            if (onClick) onClick(event);
        },
        [onClick, onSelectAll, queryOptions, limit]
    );

    const areAllDataSelected =
        data && data.every(item => selectedIds.includes(item.id));

    if (
        total === selectedIds.length ||
        selectedIds.length >= limit ||
        !areAllDataSelected
    )
        return null;

    return (
        <StyledButton
            label={label}
            onClick={handleClick}
            type="button"
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

const PREFIX = 'RaSelectAllButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaSelectAllButton: 'root';
    }

    interface ComponentsPropsList {
        RaSelectAllButton: Partial<SelectAllButtonProps>;
    }

    interface Components {
        RaSelectAllButton?: {
            defaultProps?: ComponentsPropsList['RaSelectAllButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaSelectAllButton'];
        };
    }
}
