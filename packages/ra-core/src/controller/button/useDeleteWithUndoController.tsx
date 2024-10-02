import { useCallback, ReactEventHandler } from 'react';
import { UseMutationOptions } from '@tanstack/react-query';

import { useDelete } from '../../dataProvider';
import { useUnselect } from '../../controller';
import { useRedirect, RedirectionSideEffect } from '../../routing';
import { useNotify } from '../../notification';
import { RaRecord, DeleteParams } from '../../types';
import { useResourceContext } from '../../core';
import { useTranslate } from '../../i18n';

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
 *     redirect,
 *     onClick,
 *     ...rest
 * }) => {
 *     const { isPending, handleDelete } = useDeleteWithUndoController({
 *         resource,
 *         record,
 *         redirect,
 *         onClick,
 *     });
 *
 *     return (
 *         <Button
 *             onClick={handleDelete}
 *             disabled={isPending}
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
        redirect: redirectTo = 'list',
        onClick,
        mutationOptions = {},
        successMessage,
    } = props;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;
    const resource = useResourceContext(props);
    const notify = useNotify();
    const unselect = useUnselect(resource);
    const redirect = useRedirect();
    const translate = useTranslate();
    const [deleteOne, { isPending }] = useDelete<RecordType>(
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
                        undoable: true,
                    }
                );
                record && unselect([record.id]);
                redirect(redirectTo, resource);
            },
            onError: (error: Error) => {
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
                    mutationMode: 'undoable',
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
            otherMutationOptions,
            onClick,
            record,
            resource,
        ]
    );

    return { isPending, isLoading: isPending, handleDelete };
};

export interface UseDeleteWithUndoControllerParams<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> {
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

export interface UseDeleteWithUndoControllerReturn {
    isPending: boolean;
    isLoading: boolean;
    handleDelete: ReactEventHandler<any>;
}

export default useDeleteWithUndoController;
