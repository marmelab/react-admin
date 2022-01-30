import { useCallback, ReactEventHandler } from 'react';
import { useDelete } from '../../dataProvider';
import { CRUD_DELETE } from '../../actions';
import {
    useRefresh,
    useNotify,
    useRedirect,
    RedirectionSideEffect,
} from '../../sideEffect';
import { Record, OnFailure, OnSuccess } from '../../types';
import { useResourceContext } from '../../core';

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
const useDeleteWithUndoController = (
    props: UseDeleteWithUndoControllerParams
): UseDeleteWithUndoControllerReturn => {
    const {
        record,
        basePath,
        redirect: redirectTo = 'list',
        onClick,
        onSuccess,
        onFailure,
    } = props;
    const resource = useResourceContext(props);
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();

    const [deleteOne, { loading }] = useDelete(resource, null, null, {
        action: CRUD_DELETE,
        onSuccess:
            onSuccess !== undefined
                ? onSuccess
                : () => {
                      notify('ra.notification.deleted', {
                          type: 'info',
                          messageArgs: { smart_count: 1 },
                          undoable: true,
                      });
                      redirect(redirectTo, basePath || `/${resource}`);
                      refresh();
                  },
        onFailure:
            onFailure !== undefined
                ? onFailure
                : error => {
                      notify(
                          typeof error === 'string'
                              ? error
                              : error.message || 'ra.notification.http_error',
                          {
                              type: 'warning',
                              messageArgs: {
                                  _:
                                      typeof error === 'string'
                                          ? error
                                          : error && error.message
                                          ? error.message
                                          : undefined,
                              },
                          }
                      );
                      refresh();
                  },
        mutationMode: 'undoable',
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
    // @deprecated. This hook get the resource from the context
    resource?: string;
    onClick?: ReactEventHandler<any>;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
}

export interface UseDeleteWithUndoControllerReturn {
    loading: boolean;
    handleDelete: ReactEventHandler<any>;
}

export default useDeleteWithUndoController;
