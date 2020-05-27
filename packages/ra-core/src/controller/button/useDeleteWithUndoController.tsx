import { useCallback, ReactEventHandler } from 'react';
import { useDelete } from '../../dataProvider';
import { CRUD_DELETE } from '../../actions';
import {
    useRefresh,
    useNotify,
    useRedirect,
    RedirectionSideEffect,
} from '../../sideEffect';
import { Record } from '../../types';

/**
 * Prepare callback for a Delete button with undo support
 *
 * @example
 *
 * import React from 'react';
 * import ActionDelete from '@material-ui/icons/Delete';
 * import { Button, useDeleteWithUndoController } from 'react-admin';
 *
 * const DeleteButton = ({
 *     resource,
 *     record,
 *     basePath,
 *     redirect,
 *     onClick,
 *     ...rest
 * }) => {
 *     const { loading, handleDelete } = useDeleteWithUndoController({
 *         resource,
 *         record,
 *         basePath,
 *         redirect,
 *         onClick,
 *     });
 *
 *     return (
 *         <Button
 *             onClick={handleDelete}
 *             disabled={loading}
 *             label="ra.action.delete"
 *             {...rest}
 *         >
 *             <ActionDelete />
 *         </Button>
 *     );
 * };
 */
const useDeleteWithUndoController = ({
    resource,
    record,
    basePath,
    redirect: redirectTo = 'list',
    onClick,
}: UseDeleteWithUndoControllerParams): UseDeleteWithUndoControllerReturn => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();

    const [deleteOne, { loading }] = useDelete(resource, null, null, {
        action: CRUD_DELETE,
        onSuccess: () => {
            notify('ra.notification.deleted', 'info', { smart_count: 1 }, true);
            redirect(redirectTo, basePath);
            refresh();
        },
        onFailure: error =>
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                'warning'
            ),
        undoable: true,
    });
    const handleDelete = useCallback(
        event => {
            event.stopPropagation();
            deleteOne({
                payload: { id: record.id, previousData: record },
            });
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [deleteOne, onClick, record]
    );

    return { loading, handleDelete };
};

export interface UseDeleteWithUndoControllerParams {
    basePath?: string;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource: string;
    onClick?: ReactEventHandler<any>;
}

export interface UseDeleteWithUndoControllerReturn {
    loading: boolean;
    handleDelete: ReactEventHandler<any>;
}

export default useDeleteWithUndoController;
