import * as React from 'react';
import { MutationMode, useCanAccess, useResourceContext } from 'ra-core';
import { useThemeProps } from '@mui/material/styles';

import {
    BulkDeleteWithConfirmButton,
    BulkDeleteWithConfirmButtonProps,
} from './BulkDeleteWithConfirmButton';
import {
    BulkDeleteWithUndoButton,
    BulkDeleteWithUndoButtonProps,
} from './BulkDeleteWithUndoButton';

/**
 * Deletes the selected rows.
 *
 * To be used inside the <Datagrid bulkActionButtons> prop (where it's enabled by default).
 *
 * @example // basic usage
 * import { BulkDeleteButton, BulkExportButton, List, Datagrid } from 'react-admin';
 *
 * const PostBulkActionButtons = () => (
 *     <>
 *         <BulkExportButton />
 *         <BulkDeleteButton />
 *     </>
 * );
 *
 * export const PostList = () => (
 *     <List>
 *        <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
 *             ...
 *       </Datagrid>
 *     </List>
 * );
 */
export const BulkDeleteButton = (inProps: BulkDeleteButtonProps) => {
    const { mutationMode = 'undoable', ...props } = useThemeProps({
        name: PREFIX,
        props: inProps,
    });

    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            '<BulkDeleteButton> components should be used inside a <Resource> component or provided with a resource prop.'
        );
    }
    const { canAccess, isPending } = useCanAccess({
        action: 'delete',
        resource,
    });
    if (!canAccess || isPending) {
        return null;
    }
    return mutationMode === 'undoable' ? (
        <BulkDeleteWithUndoButton {...props} />
    ) : (
        <BulkDeleteWithConfirmButton mutationMode={mutationMode} {...props} />
    );
};

interface Props {
    mutationMode?: MutationMode;
}

export type BulkDeleteButtonProps = Props &
    (BulkDeleteWithUndoButtonProps | BulkDeleteWithConfirmButtonProps);

const PREFIX = 'RaBulkDeleteButton';

declare module '@mui/material/styles' {
    interface ComponentsPropsList {
        [PREFIX]: Partial<BulkDeleteButtonProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
        };
    }
}
