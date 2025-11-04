import { useCallback, useMemo } from 'react';

import { useDelete, UseDeleteOptions } from '../../dataProvider/useDelete';
import { useUnselect } from '../list/useUnselect';
import { useRecordContext } from '../record/useRecordContext';
import { useRedirect, RedirectionSideEffect } from '../../routing/useRedirect';
import { useNotify } from '../../notification/useNotify';
import { RaRecord, MutationMode } from '../../types';
import { useResourceContext } from '../../core/useResourceContext';
import { useTranslate } from '../../i18n/useTranslate';

/**
 * Prepare a set of callbacks for a delete button
 *
 * @example
 * const DeleteButton = ({
 *     redirect,
 *     ...rest
 * }) => {
 *     const {
 *         isPending,
 *         handleDelete,
 *     } = useDeleteController({
 *         mutationMode: 'pessimistic',
 *         redirect,
 *     });
 *
 *     const [open, setOpen] = useState(false);
 *
 *     return (
 *         <Fragment>
 *             <Button
 *                 onClick={() => setOpen(true)}
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
 *                 onConfirm={() => handleDelete()}
 *                 onClose={() => setOpen(false)}
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
    const {
        redirect: redirectTo = 'list',
        mutationMode = 'undoable',
        mutationOptions = {},
        successMessage,
    } = props;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;
    const record = useRecordContext(props);
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
                record && unselect([record.id], true);
                redirect(redirectTo, resource);
            },
            onError: (error: any) => {
                notify(
                    typeof error === 'string'
                        ? error
                        : error?.message || 'ra.notification.http_error',
                    {
                        type: 'error',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error?.message,
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

    return useMemo(
        () => ({
            isPending,
            isLoading: isPending,
            handleDelete,
        }),
        [isPending, handleDelete]
    );
};

export interface UseDeleteControllerParams<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> {
    mutationMode?: MutationMode;
    mutationOptions?: UseDeleteOptions<RecordType, MutationOptionsError>;
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
