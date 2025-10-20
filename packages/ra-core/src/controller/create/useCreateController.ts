import { useCallback } from 'react';
import { UseMutationOptions } from '@tanstack/react-query';

import { useAuthenticated, useRequireAccess } from '../../auth';
import {
    HttpError,
    useCreate,
    UseCreateMutateParams,
} from '../../dataProvider';
import { useRedirect, RedirectionSideEffect } from '../../routing';
import { useNotify } from '../../notification';
import {
    SaveContextValue,
    SaveHandlerCallbacks,
    useMutationMiddlewares,
} from '../saveContext';
import { useTranslate } from '../../i18n';
import { Identifier, MutationMode, RaRecord, TransformData } from '../../types';
import {
    useResourceContext,
    useResourceDefinition,
    useGetResourceLabel,
} from '../../core';

/**
 * Prepare data for the Create view
 *
 * @param {Object} props The props passed to the Create component.
 *
 * @return {Object} controllerProps Fetched data and callbacks for the Create view
 *
 * @example
 *
 * import { useCreateController } from 'react-admin';
 * import CreateView from './CreateView';
 *
 * const MyCreate = props => {
 *     const controllerProps = useCreateController(props);
 *     return <CreateView {...controllerProps} {...props} />;
 * }
 */
export const useCreateController = <
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationOptionsError = Error,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
>(
    props: CreateControllerProps<
        RecordType,
        MutationOptionsError,
        ResultRecordType
    > = {}
): CreateControllerResult<RecordType> => {
    const {
        disableAuthentication,
        record,
        redirect: redirectTo,
        transform,
        mutationMode = 'pessimistic',
        mutationOptions = {},
    } = props;

    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            'useCreateController requires a non-empty resource prop or context'
        );
    }
    const { isPending: isPendingAuthenticated } = useAuthenticated({
        enabled: !disableAuthentication,
    });
    const { isPending: isPendingCanAccess } = useRequireAccess<RecordType>({
        action: 'create',
        resource,
        enabled: !disableAuthentication && !isPendingAuthenticated,
    });
    const { hasEdit, hasShow } = useResourceDefinition(props);
    const finalRedirectTo =
        redirectTo ?? getDefaultRedirectRoute(hasShow, hasEdit);
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const { onSuccess, onError, meta, ...otherMutationOptions } =
        mutationOptions;
    const {
        registerMutationMiddleware,
        getMutateWithMiddlewares,
        unregisterMutationMiddleware,
    } = useMutationMiddlewares();

    const [create, { isPending: saving }] = useCreate<
        RecordType,
        MutationOptionsError,
        ResultRecordType
    >(resource, undefined, {
        onSuccess: async (...args) => {
            if (onSuccess) {
                return onSuccess(...args);
            }
            const [data] = args;
            notify(`resources.${resource}.notifications.created`, {
                type: 'info',
                messageArgs: {
                    smart_count: 1,
                    _: translate(`ra.notification.created`, {
                        smart_count: 1,
                    }),
                },
                undoable: mutationMode === 'undoable',
            });
            redirect(finalRedirectTo, resource, data.id, data);
        },
        onError: (...args) => {
            if (onError) {
                return onError(...args);
            }
            const [error] = args;
            // Don't trigger a notification if this is a validation error
            // (notification will be handled by the useNotifyIsFormInvalid hook)
            const validationErrors = (error as HttpError)?.body?.errors;
            const hasValidationErrors =
                !!validationErrors && Object.keys(validationErrors).length > 0;
            if (!hasValidationErrors || mutationMode !== 'pessimistic') {
                notify(
                    typeof error === 'string'
                        ? error
                        : (error as Error).message ||
                              'ra.notification.http_error',
                    {
                        type: 'error',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error instanceof Error ||
                                        (typeof error === 'object' &&
                                            error !== null &&
                                            error.hasOwnProperty('message'))
                                      ? // @ts-ignore
                                        error.message
                                      : undefined,
                        },
                    }
                );
            }
        },
        ...otherMutationOptions,
        mutationMode,
        returnPromise: mutationMode === 'pessimistic',
        getMutateWithMiddlewares,
    });

    const save = useCallback(
        (
            data: Partial<RecordType>,
            {
                onSuccess: onSuccessFromSave,
                onError: onErrorFromSave,
                transform: transformFromSave,
                meta: metaFromSave,
            } = {} as SaveHandlerCallbacks
        ) =>
            Promise.resolve(
                transformFromSave
                    ? transformFromSave(data)
                    : transform
                      ? transform(data)
                      : data
            ).then(async (data: Partial<RecordType>) => {
                try {
                    await create(
                        resource,
                        { data, meta: metaFromSave ?? meta },
                        {
                            onError: onErrorFromSave,
                            onSuccess: onSuccessFromSave,
                        }
                    );
                } catch (error) {
                    if (
                        (error instanceof HttpError ||
                            (typeof error === 'object' &&
                                error !== null &&
                                error.hasOwnProperty('body'))) &&
                        error.body?.errors != null
                    ) {
                        return error.body.errors;
                    }
                }
            }),
        [create, meta, resource, transform]
    );

    const getResourceLabel = useGetResourceLabel();
    const defaultTitle = translate(`resources.${resource}.page.create`, {
        _: translate('ra.page.create', {
            name: getResourceLabel(resource, 1),
        }),
    });

    return {
        isFetching: false,
        isLoading: false,
        isPending: disableAuthentication ? false : isPendingCanAccess,
        mutationMode,
        saving,
        defaultTitle,
        save,
        record,
        resource,
        redirect: finalRedirectTo,
        registerMutationMiddleware,
        unregisterMutationMiddleware,
    };
};

export interface CreateControllerProps<
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationOptionsError = Error,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
> {
    disableAuthentication?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    record?: Partial<RecordType>;
    redirect?: RedirectionSideEffect;
    resource?: string;
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<
        ResultRecordType,
        MutationOptionsError,
        UseCreateMutateParams<RecordType>
    > & { meta?: any };
    transform?: TransformData;
}

export interface CreateControllerResult<
    RecordType extends Omit<RaRecord, 'id'> = any,
> extends SaveContextValue {
    defaultTitle?: string;
    isFetching: boolean;
    isPending: boolean;
    isLoading: boolean;
    record?: Partial<RecordType>;
    redirect: RedirectionSideEffect;
    resource: string;
    saving: boolean;
}

const getDefaultRedirectRoute = (hasShow, hasEdit) => {
    if (hasEdit) {
        return 'edit';
    }
    if (hasShow) {
        return 'show';
    }
    return 'list';
};
