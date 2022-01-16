import { useCallback, ReactEventHandler } from 'react';
import { UseMutationOptions } from 'react-query';

import { useDelete } from '../../dataProvider';
import { useUnselect } from '../../sideEffect';
import { useRedirect, RedirectionSideEffect } from '../../routing';
import { useNotify } from '../../notification';
import { RaRecord, DeleteParams } from '../../types';
import { useResourceContext } from '../../core';

/**
 * Prepare callback for a Delete button with undo support
 *
 * @example
 *
 * import React from 'react';
 * import ActionDelete from '@mui/icons-material/Delete';
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
 *     const { isLoading, handleDelete } = useDeleteWithUndoController({
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
 *             disabled={isLoading}
 *             label="ra.action.delete"
 *             {...rest}
 *         >
 *             <ActionDelete />
 *         </Button>
 *     );
 * };
 */
const useDeleteWithUndoController = <RecordType extends RaRecord = any>(
    props: UseDeleteWithUndoControllerParams<RecordType>
): UseDeleteWithUndoControllerReturn => {
    const {
        record,
        basePath,
        redirect: redirectTo = 'list',
        onClick,
        mutationOptions,
    } = props;
    const resource = useResourceContext(props);
    const notify = useNotify();
    const unselect = useUnselect();
    const redirect = useRedirect();
    const [deleteOne, { isLoading }] = useDelete<RecordType>();

    const handleDelete = useCallback(
        event => {
            event.stopPropagation();
            deleteOne(
                resource,
                { id: record.id, previousData: record },
                {
                    onSuccess: () => {
                        notify('ra.notification.deleted', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                            undoable: true,
                        });
                        unselect(resource, [record.id]);
                        redirect(redirectTo, basePath || `/${resource}`);
                    },
                    onError: (error: Error) => {
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
                    },
                    mutationMode: 'undoable',
                    ...mutationOptions,
                }
            );
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [
            basePath,
            deleteOne,
            mutationOptions,
            notify,
            onClick,
            record,
            redirect,
            redirectTo,
            resource,
            unselect,
        ]
    );

    return { isLoading, handleDelete };
};

export interface UseDeleteWithUndoControllerParams<
    RecordType extends RaRecord = any
> {
    basePath?: string;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    // @deprecated. This hook get the resource from the context
    resource?: string;
    onClick?: ReactEventHandler<any>;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        DeleteParams<RecordType>
    >;
}

export interface UseDeleteWithUndoControllerReturn {
    isLoading: boolean;
    handleDelete: ReactEventHandler<any>;
}

export default useDeleteWithUndoController;
