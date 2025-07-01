import * as React from 'react';
import { MutationMode } from 'ra-core';
import { useThemeProps } from '@mui/material/styles';

import {
    BulkUpdateWithConfirmButton,
    BulkUpdateWithConfirmButtonProps,
} from './BulkUpdateWithConfirmButton';
import {
    BulkUpdateWithUndoButton,
    BulkUpdateWithUndoButtonProps,
} from './BulkUpdateWithUndoButton';

/**
 * Updates the selected rows.
 *
 * To be used inside the <Datagrid bulkActionButtons> prop (where it's enabled by default).
 *
 * @example // basic usage
 * import { BulkUpdateButton, BulkExportButton, List, Datagrid } from 'react-admin';
 *
 * const PostBulkActionButtons = () => (
 *     <>
 *         <BulkExportButton />
 *         <BulkUpdateButton label="Reset Views" data={{ views: 0 }} />
 *     </>
 * );
 *
 * export const PostList = () => (
 *     <List>
 *        <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
 *          ...
 *        </Datagrid>
 *     </List>
 * );
 */
export const BulkUpdateButton = (props: BulkUpdateButtonProps) => {
    const {
        mutationMode = 'undoable',
        data = defaultData,
        ...rest
    } = useThemeProps({
        name: PREFIX,
        props: props,
    });

    return mutationMode === 'undoable' ? (
        <BulkUpdateWithUndoButton data={data} {...rest} />
    ) : (
        <BulkUpdateWithConfirmButton
            mutationMode={mutationMode}
            data={data}
            {...rest}
        />
    );
};

interface Props {
    mutationMode?: MutationMode;
}

export type BulkUpdateButtonProps = Props &
    (BulkUpdateWithUndoButtonProps | BulkUpdateWithConfirmButtonProps);

const defaultData = [];

const PREFIX = 'RaBulkUpdateButton';

declare module '@mui/material/styles' {
    interface ComponentsPropsList {
        [PREFIX]: Partial<BulkUpdateButtonProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
        };
    }
}
