import { useCallback, useMemo } from 'react';
import {
    useDeleteMany,
    UseDeleteManyOptions,
} from '../../dataProvider/useDeleteMany';
import { useRefresh } from '../../dataProvider/useRefresh';
import { useListContext } from '../list/useListContext';
import { useNotify } from '../../notification/useNotify';
import { RaRecord, MutationMode } from '../../types';
import { useResourceContext } from '../../core/useResourceContext';
import { useTranslate } from '../../i18n/useTranslate';

export const useBulkDeleteController = <
    RecordType extends RaRecord = any,
    ErrorType = Error,
>(
    props: UseBulkDeleteControllerParams<RecordType, ErrorType>
): UseBulkDeleteControllerReturn => {
    const {
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

    const [deleteMany, { isPending }] = useDeleteMany<RecordType, ErrorType>(
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
                            smart_count: selectedIds.length,
                            _: translate('ra.notification.deleted', {
                                smart_count: selectedIds.length,
                            }),
                        },
                        undoable: mutationMode === 'undoable',
                    }
                );
                onUnselectItems(true);
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
                refresh();
            },
        }
    );

    const handleDelete = useCallback(() => {
        deleteMany(
            resource,
            {
                ids: selectedIds,
                meta: mutationMeta,
            },
            {
                mutationMode,
                ...otherMutationOptions,
            }
        );
    }, [
        deleteMany,
        mutationMeta,
        mutationMode,
        otherMutationOptions,
        resource,
        selectedIds,
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

export interface UseBulkDeleteControllerParams<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> {
    mutationMode?: MutationMode;
    mutationOptions?: UseDeleteManyOptions<RecordType, MutationOptionsError>;
    resource?: string;
    successMessage?: string;
}

export interface UseBulkDeleteControllerReturn {
    isLoading: boolean;
    isPending: boolean;
    handleDelete: () => void;
}
