import {
    useState,
    useCallback,
    ReactEventHandler,
    SyntheticEvent,
} from 'react';
import { UseMutationOptions } from 'react-query';

import { useDelete } from '../../dataProvider';
import {
    useRedirect,
    useUnselect,
    RedirectionSideEffect,
} from '../../sideEffect';
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
 *     basePath,
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
 *         basePath,
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
const useDeleteWithConfirmController = <RaRecordType extends RaRecord = any>(
    props: UseDeleteWithConfirmControllerParams<RaRecordType>
): UseDeleteWithConfirmControllerReturn => {
    const {
        record,
        redirect: redirectTo,
        basePath,
        mutationMode,
        onClick,
        mutationOptions,
    } = props;
    const resource = useResourceContext(props);
    const [open, setOpen] = useState(false);
    const notify = useNotify();
    const unselect = useUnselect();
    const redirect = useRedirect();
    const [deleteOne, { isLoading }] = useDelete<RaRecordType>();

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
                { id: record.id, previousData: record },
                {
                    onSuccess: () => {
                        setOpen(false);
                        notify('ra.notification.deleted', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                            undoable: mutationMode === 'undoable',
                        });
                        unselect(resource, [record.id]);
                        redirect(redirectTo, basePath || `/${resource}`);
                    },
                    onError: (error: Error) => {
                        setOpen(false);

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
                    mutationMode,
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
            mutationMode,
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

    return {
        open,
        isLoading,
        handleDialogOpen,
        handleDialogClose,
        handleDelete,
    };
};

export interface UseDeleteWithConfirmControllerParams<
    RaRecordType extends RaRecord = any
> {
    basePath?: string;
    mutationMode?: MutationMode;
    record?: RaRecordType;
    redirect?: RedirectionSideEffect;
    // @deprecated. This hook get the resource from the context
    resource?: string;
    onClick?: ReactEventHandler<any>;
    mutationOptions?: UseMutationOptions<
        RaRecordType,
        unknown,
        DeleteParams<RaRecordType>
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
