import { useCallback } from 'react';
import { UseMutationOptions } from '@tanstack/react-query';

import { useDelete } from '../../dataProvider';
import { useUnselect } from '../';
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
 *                 titleTranslateOptions={{
 *                     name: resource,
 *                     id: record.id,
 *                 }}
 *                 contentTranslateOptions={{
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
export const useDeleteController = <
    RecordType extends RaRecord = any,
    ErrorType = Error,
>(
    props: UseDeleteControllerParams<RecordType, ErrorType>
): UseDeleteControllerReturn => {
    const { mutationMode } = props;
    const {
        record,
        redirect: redirectTo = 'list',
        mutationOptions = {},
        successMessage,
    } = props as UseDeleteControllerParams<RecordType, ErrorType>;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;
    const resource = useResourceContext(props);
    const notify = useNotify();
    const unselect = useUnselect(resource);
    const redirect = useRedirect();
    const translate = useTranslate();

    const [deleteOne, { isPending }] = useDelete<RecordType, ErrorType>(
        resource,
        undefined,
        {
            onSuccess: () => {
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
            onError: error => {
                notify(
                    typeof error === 'string'
                        ? error
                        : (error as Error)?.message ||
                              'ra.notification.http_error',
                    {
                        type: 'error',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : (error as Error)?.message
                                      ? (error as Error).message
                                      : undefined,
                        },
                    }
                );
            },
        }
    );

    const handleDelete = useCallback(() => {
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
    }, [
        deleteOne,
        mutationMeta,
        mutationMode,
        otherMutationOptions,
        record,
        resource,
    ]);

    return {
        isPending,
        isLoading: isPending,
        handleDelete,
    };
};

export interface UseDeleteControllerParams<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> {
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteParams<RecordType>
    >;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
    successMessage?: string;
}

export interface UseDeleteControllerReturn {
    isLoading: boolean;
    isPending: boolean;
    handleDelete: () => void;
}
