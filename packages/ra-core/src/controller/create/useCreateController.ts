import { useCallback } from 'react';
// @ts-ignore
import { parse } from 'query-string';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import { UseMutationOptions } from 'react-query';

import { useAuthenticated } from '../../auth';
import {
    HttpError,
    useCreate,
    UseCreateMutateParams,
} from '../../dataProvider';
import { useRedirect, RedirectionSideEffect } from '../../routing';
import { useNotify } from '../../notification';
import { SaveContextValue, useMutationMiddlewares } from '../saveContext';
import { useTranslate } from '../../i18n';
import { Identifier, RaRecord, TransformData } from '../../types';
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
    MutationOptionsError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
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
        mutationOptions = {},
    } = props;

    useAuthenticated({ enabled: !disableAuthentication });
    const resource = useResourceContext(props);
    const { hasEdit, hasShow } = useResourceDefinition(props);
    const finalRedirectTo =
        redirectTo ?? getDefaultRedirectRoute(hasShow, hasEdit);
    const location = useLocation();
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const recordToUse = record ?? getRecordFromLocation(location) ?? undefined;
    const {
        onSuccess,
        onError,
        meta,
        ...otherMutationOptions
    } = mutationOptions;
    const {
        registerMutationMiddleware,
        getMutateWithMiddlewares,
        unregisterMutationMiddleware,
    } = useMutationMiddlewares();

    const [create, { isLoading: saving }] = useCreate<
        RecordType,
        MutationOptionsError,
        ResultRecordType
    >(resource, undefined, { ...otherMutationOptions, returnPromise: true });

    const save = useCallback(
        (
            data: Partial<RecordType>,
            {
                onSuccess: onSuccessFromSave,
                onError: onErrorFromSave,
                transform: transformFromSave,
                meta: metaFromSave,
            } = {}
        ) =>
            Promise.resolve(
                transformFromSave
                    ? transformFromSave(data)
                    : transform
                    ? transform(data)
                    : data
            ).then(async (data: Partial<RecordType>) => {
                const mutate = getMutateWithMiddlewares(create);
                try {
                    await mutate(
                        resource,
                        { data, meta: metaFromSave ?? meta },
                        {
                            onSuccess: async (data, variables, context) => {
                                if (onSuccessFromSave) {
                                    return onSuccessFromSave(
                                        data,
                                        variables,
                                        context
                                    );
                                }
                                if (onSuccess) {
                                    return onSuccess(data, variables, context);
                                }

                                notify('ra.notification.created', {
                                    type: 'info',
                                    messageArgs: { smart_count: 1 },
                                });
                                redirect(
                                    finalRedirectTo,
                                    resource,
                                    data.id,
                                    data
                                );
                            },
                            onError: onErrorFromSave
                                ? onErrorFromSave
                                : onError
                                ? onError
                                : (error: Error) => {
                                      notify(
                                          typeof error === 'string'
                                              ? error
                                              : error.message ||
                                                    'ra.notification.http_error',
                                          {
                                              type: 'error',
                                              messageArgs: {
                                                  _:
                                                      typeof error === 'string'
                                                          ? error
                                                          : error &&
                                                            error.message
                                                          ? error.message
                                                          : undefined,
                                              },
                                          }
                                      );
                                  },
                        }
                    );
                } catch (error) {
                    if ((error as HttpError).body?.errors != null) {
                        return (error as HttpError).body.errors;
                    }
                }
            }),
        [
            create,
            finalRedirectTo,
            getMutateWithMiddlewares,
            meta,
            notify,
            onError,
            onSuccess,
            redirect,
            resource,
            transform,
        ]
    );

    const getResourceLabel = useGetResourceLabel();
    const defaultTitle = translate('ra.page.create', {
        name: getResourceLabel(resource, 1),
    });

    return {
        isFetching: false,
        isLoading: false,
        saving,
        defaultTitle,
        save,
        resource,
        record: recordToUse,
        redirect: finalRedirectTo,
        registerMutationMiddleware,
        unregisterMutationMiddleware,
    };
};

export interface CreateControllerProps<
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationOptionsError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
> {
    disableAuthentication?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    record?: Partial<RecordType>;
    redirect?: RedirectionSideEffect;
    resource?: string;
    mutationOptions?: UseMutationOptions<
        ResultRecordType,
        MutationOptionsError,
        UseCreateMutateParams<RecordType>
    > & { meta?: any };
    transform?: TransformData;
}

export interface CreateControllerResult<
    RecordType extends Omit<RaRecord, 'id'> = any
> extends SaveContextValue {
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data?: RecordType;
    defaultTitle: string;
    isFetching: boolean;
    isLoading: boolean;
    record?: Partial<RecordType>;
    redirect: RedirectionSideEffect;
    resource: string;
}

/**
 * Get the initial record from the location, whether it comes from the location
 * state or is serialized in the url search part.
 */
export const getRecordFromLocation = ({ state, search }: Location) => {
    if (state && (state as StateWithRecord).record) {
        return (state as StateWithRecord).record;
    }
    if (search) {
        try {
            const searchParams = parse(search);
            if (searchParams.source) {
                if (Array.isArray(searchParams.source)) {
                    console.error(
                        `Failed to parse location search parameter '${search}'. To pre-fill some fields in the Create form, pass a stringified source parameter (e.g. '?source={"title":"foo"}')`
                    );
                    return;
                }
                return JSON.parse(searchParams.source);
            }
        } catch (e) {
            console.error(
                `Failed to parse location search parameter '${search}'. To pre-fill some fields in the Create form, pass a stringified source parameter (e.g. '?source={"title":"foo"}')`
            );
        }
    }
    return null;
};

type StateWithRecord = {
    record?: Partial<RaRecord>;
};

const getDefaultRedirectRoute = (hasShow, hasEdit) => {
    if (hasEdit) {
        return 'edit';
    }
    if (hasShow) {
        return 'show';
    }
    return 'list';
};
