import {
    useState,
    useCallback,
    ReactEventHandler,
    SyntheticEvent,
} from 'react';
import { UseMutationOptions } from 'react-query';

import { useDelete } from '../../dataProvider';
import { useUnselect } from '../../controller';
import { useRedirect, RedirectionSideEffect } from '../../routing';
import { useNotify } from '../../notification';
import { RaRecord, MutationMode, DeleteParams } from '../../types';
import { useResourceContext } from '../../core';

/**
 * Prepare a set of callbacks for a delete button guarded by confirmation dialog
 *
 * @example
 *
 * const DeleteButton = ({
 *     resource,
 *     record,
 *     redirect,
 *     onClick,
 *     ...rest
 * }) => {
 *     const {
 *         open,
 *         isLoading,
 *         handleDialogOpen,
 *         handleDialogClose,
 *         handleDelete,
 *     } = useDeleteWithConfirmController({
 *         resource,
 *         record,
 *         redirect,
 *         onClick,
 *     });
 *
 *     return (
 *         <Fragment>
 *             <Button
 *                 onClick={handleDialogOpen}
 *                 label="ra.action.delete"
 *                 {...rest}
 *             >
 *                 {icon}
 *             </Button>
 *             <Confirm
 *                 isOpen={open}
 *                 loading={isLoading}
 *                 title="ra.message.delete_title"
 *                 content="ra.message.delete_content"
 *                 translateOptions={{
 *                     name: resource,
 *                     id: record.id,
 *                 }}
 *                 onConfirm={handleDelete}
 *                 onClose={handleDialogClose}
 *             />
 *         </Fragment>
 *     );
 * };
 */
const useDeleteWithConfirmController = <RecordType extends RaRecord = any>(
    props: UseDeleteWithConfirmControllerParams<RecordType>
): UseDeleteWithConfirmControllerReturn => {
    const {
        record,
        redirect: redirectTo,
        mutationMode,
        onClick,
        mutationOptions = {},
    } = props;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;
    const resource = useResourceContext(props);
    const [open, setOpen] = useState(false);
    const notify = useNotify();
    const unselect = useUnselect(resource);
    const redirect = useRedirect();
    const [deleteOne, { isLoading }] = useDelete<RecordType>();

    const handleDialogOpen = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = e => {
        setOpen(false);
        e.stopPropagation();
    };

    const handleDelete = useCallback(
        event => {
            event.stopPropagation();
            deleteOne(
                resource,
                {
                    id: record.id,
                    previousData: record,
                    meta: mutationMeta,
                },
                {
                    onSuccess: () => {
                        setOpen(false);
                        notify('ra.notification.deleted', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                            undoable: mutationMode === 'undoable',
                        });
                        unselect([record.id]);
                        redirect(redirectTo, resource);
                    },
                    onError: (error: Error) => {
                        setOpen(false);

                        notify(
                            typeof error === 'string'
                                ? error
                                : error.message || 'ra.notification.http_error',
                            {
                                type: 'error',
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
                    mutationMode,
                    ...otherMutationOptions,
                }
            );
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [
            deleteOne,
            mutationMeta,
            mutationMode,
            otherMutationOptions,
            notify,
            onClick,
            record,
            redirect,
            redirectTo,
            resource,
            unselect,
        ]
    );

    return {
        open,
        isLoading,
        handleDialogOpen,
        handleDialogClose,
        handleDelete,
    };
};

export interface UseDeleteWithConfirmControllerParams<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> {
    mutationMode?: MutationMode;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    // @deprecated. This hook get the resource from the context
    resource?: string;
    onClick?: ReactEventHandler<any>;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteParams<RecordType>
    >;
}

export interface UseDeleteWithConfirmControllerReturn {
    open: boolean;
    isLoading: boolean;
    handleDialogOpen: (e: SyntheticEvent) => void;
    handleDialogClose: (e: SyntheticEvent) => void;
    handleDelete: ReactEventHandler<any>;
}

export default useDeleteWithConfirmController;
