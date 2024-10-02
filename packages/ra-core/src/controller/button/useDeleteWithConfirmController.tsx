import {
    useState,
    useCallback,
    ReactEventHandler,
    SyntheticEvent,
} from 'react';
import { UseMutationOptions } from '@tanstack/react-query';

import { useDelete } from '../../dataProvider';
import { useUnselect } from '../../controller';
import { useRedirect, RedirectionSideEffect } from '../../routing';
import { useNotify } from '../../notification';
import { RaRecord, MutationMode, DeleteParams } from '../../types';
import { useResourceContext } from '../../core';
import { useTranslate } from '../../i18n';

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
 *         isPending,
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
 *                 loading={isPending}
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
        redirect: redirectTo = 'list',
        mutationMode,
        onClick,
        mutationOptions = {},
        successMessage,
    } = props;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;
    const resource = useResourceContext(props);
    const [open, setOpen] = useState(false);
    const notify = useNotify();
    const unselect = useUnselect(resource);
    const redirect = useRedirect();
    const translate = useTranslate();

    const [deleteOne, { isPending }] = useDelete<RecordType>(
        resource,
        undefined,
        {
            onSuccess: () => {
                setOpen(false);
                notify(
                    successMessage ??
                        `resources.${resource}.notifications.deleted`,
                    {
                        type: 'info',
                        messageArgs: {
                            smart_count: 1,
                            _: translate('ra.notification.deleted', {
                                smart_count: 1,
                            }),
                        },
                        undoable: mutationMode === 'undoable',
                    }
                );
                record && unselect([record.id]);
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
        }
    );

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
            if (!record) {
                throw new Error(
                    'The record cannot be deleted because no record has been passed'
                );
            }
            deleteOne(
                resource,
                {
                    id: record.id,
                    previousData: record,
                    meta: mutationMeta,
                },
                {
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
            onClick,
            record,
            resource,
        ]
    );

    return {
        open,
        isPending,
        isLoading: isPending,
        handleDialogOpen,
        handleDialogClose,
        handleDelete,
    };
};

export interface UseDeleteWithConfirmControllerParams<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> {
    mutationMode?: MutationMode;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
    onClick?: ReactEventHandler<any>;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteParams<RecordType>
    >;
    successMessage?: string;
}

export interface UseDeleteWithConfirmControllerReturn {
    open: boolean;
    isLoading: boolean;
    isPending: boolean;
    handleDialogOpen: (e: SyntheticEvent) => void;
    handleDialogClose: (e: SyntheticEvent) => void;
    handleDelete: ReactEventHandler<any>;
}

export default useDeleteWithConfirmController;
