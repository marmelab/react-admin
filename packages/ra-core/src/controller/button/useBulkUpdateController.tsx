import { useCallback, useMemo } from 'react';
import { useRefresh } from '../../dataProvider/useRefresh';
import { useListContext } from '../list/useListContext';
import { useNotify } from '../../notification/useNotify';
import { RaRecord, MutationMode } from '../../types';
import { useResourceContext } from '../../core/useResourceContext';
import { useTranslate } from '../../i18n/useTranslate';
import {
    useUpdateMany,
    UseUpdateManyOptions,
} from '../../dataProvider/useUpdateMany';

export const useBulkUpdateController = <
    RecordType extends RaRecord = any,
    ErrorType = Error,
>(
    props: UseBulkUpdateControllerParams<RecordType, ErrorType>
): UseBulkUpdateControllerReturn => {
    const {
        onSuccess,
        onError,
        mutationMode = 'undoable',
        mutationOptions = {},
        successMessage,
    } = props;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;
    const resource = useResourceContext(props);
    const notify = useNotify();
    const refresh = useRefresh();
    const translate = useTranslate();
    const { selectedIds, onUnselectItems } = useListContext();

    const [updateMany, { isPending }] = useUpdateMany<RecordType, ErrorType>(
        resource,
        undefined,
        {
            onSuccess:
                onSuccess ??
                (() => {
                    notify(
                        successMessage ??
                            `resources.${resource}.notifications.updated`,
                        {
                            type: 'info',
                            messageArgs: {
                                smart_count: selectedIds.length,
                                _: translate('ra.notification.updated', {
                                    smart_count: selectedIds.length,
                                }),
                            },
                            undoable: mutationMode === 'undoable',
                        }
                    );
                    onUnselectItems();
                }),
            onError:
                onError ??
                ((error: any) => {
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
                    refresh();
                }),
            ...otherMutationOptions,
        }
    );

    const handleUpdate = useCallback(
        (data: Partial<RecordType>) => {
            updateMany(
                resource,
                {
                    data,
                    ids: selectedIds,
                    meta: mutationMeta,
                },
                {
                    mutationMode,
                    ...otherMutationOptions,
                }
            );
        },
        [
            updateMany,
            mutationMeta,
            mutationMode,
            otherMutationOptions,
            resource,
            selectedIds,
        ]
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

export interface UseBulkUpdateControllerParams<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> {
    /* @deprecated use mutationOptions instead */
    onSuccess?: () => void;
    /* @deprecated use mutationOptions instead */
    onError?: (error: any) => void;
    mutationMode?: MutationMode;
    mutationOptions?: UseUpdateManyOptions<RecordType, MutationOptionsError>;
    resource?: string;
    successMessage?: string;
}

export interface UseBulkUpdateControllerReturn<
    RecordType extends RaRecord = any,
> {
    isLoading: boolean;
    isPending: boolean;
    handleUpdate: (data: Partial<RecordType>) => void;
}
