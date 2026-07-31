import { useCallback, useMemo } from 'react';
import { useUpdate, UseUpdateOptions } from '../../dataProvider/useUpdate';
import { useRedirect, RedirectionSideEffect } from '../../routing/useRedirect';
import { useNotify } from '../../notification/useNotify';
import { RaRecord, MutationMode } from '../../types';
import { useRecordContext } from '../record/useRecordContext';
import { useResourceContext } from '../../core/useResourceContext';
import { useTranslate } from '../../i18n/useTranslate';

/**
 * Prepare a set of callbacks for an update button
 *
 * @example
 * const UpdateButton = ({
 *     resource,
 *     record,
 *     redirect,
 *     ...rest
 * }) => {
 *     const {
 *         isPending,
 *         handleUpdate,
 *     } = useUpdateController({
 *         mutationMode: 'pessimistic',
 *         resource,
 *         record,
 *         redirect,
 *     });
 *
 *     const [open, setOpen] = useState(false);
 *
 *     return (
 *         <Fragment>
 *             <Button
 *                 onClick={() => setOpen(true)}
 *                 label="ra.action.update"
 *                 {...rest}
 *             >
 *                 {icon}
 *             </Button>
 *             <Confirm
 *                 isOpen={open}
 *                 loading={isPending}
 *                 title="ra.message.update_title"
 *                 content="ra.message.update_content"
 *                 titleTranslateOptions={{
 *                     name: resource,
 *                     id: record.id,
 *                 }}
 *                 contentTranslateOptions={{
 *                     name: resource,
 *                     id: record.id,
 *                 }}
 *                 onConfirm={() => handleUpdate()}
 *                 onClose={() => setOpen(false)}
 *             />
 *         </Fragment>
 *     );
 * };
 */
export const useUpdateController = <
    RecordType extends RaRecord = any,
    ErrorType = Error,
>(
    props: UseUpdateControllerParams<RecordType, ErrorType>
): UseUpdateControllerReturn<RecordType> => {
    const {
        redirect: redirectTo = false,
        mutationMode = 'undoable',
        mutationOptions = {},
        successMessage,
    } = props;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;
    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    const notify = useNotify();
    const redirect = useRedirect();
    const translate = useTranslate();

    const [updateOne, { isPending }] = useUpdate<RecordType, ErrorType>(
        resource,
        undefined,
        {
            onSuccess: () => {
                notify(
                    successMessage ??
                        `resources.${resource}.notifications.updated`,
                    {
                        type: 'info',
                        messageArgs: {
                            smart_count: 1,
                            _: translate('ra.notification.updated', {
                                smart_count: 1,
                            }),
                        },
                        undoable: mutationMode === 'undoable',
                    }
                );
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
                                    : (error as Error)?.message,
                        },
                    }
                );
            },
            mutationMode,
            ...otherMutationOptions,
        }
    );

    const handleUpdate = useCallback(
        (data: Partial<RecordType>) => {
            if (!record) {
                throw new Error(
                    'The record cannot be updated because no record has been passed'
                );
            }
            updateOne(resource, {
                id: record.id,
                data,
                previousData: record,
                meta: mutationMeta,
            });
        },
        [updateOne, mutationMeta, record, resource]
    );

    return useMemo(
        () => ({
            isPending,
            isLoading: isPending,
            handleUpdate,
        }),
        [isPending, handleUpdate]
    );
};

export interface UseUpdateControllerParams<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> {
    mutationMode?: MutationMode;
    mutationOptions?: UseUpdateOptions<RecordType, MutationOptionsError>;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
    successMessage?: string;
}

export interface UseUpdateControllerReturn<RecordType extends RaRecord = any> {
    isLoading: boolean;
    isPending: boolean;
    handleUpdate: (data: Partial<RecordType>) => void;
}
