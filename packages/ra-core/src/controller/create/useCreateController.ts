import { useCallback } from 'react';
// @ts-ignore
import { parse } from 'query-string';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import { UseMutationOptions } from 'react-query';

import { useAuthenticated } from '../../auth';
import { useCreate } from '../../dataProvider';
import { useRedirect, RedirectionSideEffect } from '../../routing';
import { useNotify } from '../../notification';
import { SaveHandler } from '../saveContext';
import { useTranslate } from '../../i18n';
import { RaRecord, CreateParams, TransformData } from '../../types';
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
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
>(
    props: CreateControllerProps = {}
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
        redirectTo || getDefaultRedirectRoute(hasShow, hasEdit);
    const location = useLocation();
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const recordToUse = record ?? getRecordFromLocation(location) ?? undefined;
    const { onSuccess, onError, ...otherMutationOptions } = mutationOptions;

    const [create, { isLoading: saving }] = useCreate(
        resource,
        undefined,
        otherMutationOptions
    );

    const save = useCallback(
        (
            data: Partial<RaRecord>,
            {
                onSuccess: onSuccessFromSave,
                onError: onErrorFromSave,
                transform: transformFromSave,
            } = {}
        ) => {
            return Promise.resolve(
                transformFromSave
                    ? transformFromSave(data)
                    : transform
                    ? transform(data)
                    : data
            ).then(data =>
                create(
                    resource,
                    { data },
                    {
                        onSuccess: onSuccessFromSave
                            ? onSuccessFromSave
                            : onSuccess
                            ? onSuccess
                            : newRecord => {
                                  notify('ra.notification.created', {
                                      type: 'info',
                                      messageArgs: { smart_count: 1 },
                                  });
                                  redirect(
                                      finalRedirectTo,
                                      resource,
                                      newRecord.id,
                                      newRecord
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
                    }
                )
            );
        },
        [
            create,
            finalRedirectTo,
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
    };
};

export interface CreateControllerProps<
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
> {
    disableAuthentication?: boolean;
    record?: Partial<RecordType>;
    redirect?: RedirectionSideEffect;
    resource?: string;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        CreateParams<RecordType>
    >;
    transform?: TransformData;
}

export interface CreateControllerResult<
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
> {
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data?: RecordType;
    defaultTitle: string;
    isFetching: boolean;
    isLoading: boolean;
    save: SaveHandler;
    saving: boolean;
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
