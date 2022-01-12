import { useCallback, MutableRefObject } from 'react';
// @ts-ignore
import { parse } from 'query-string';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import { UseMutationOptions } from 'react-query';

import { useAuthenticated } from '../../auth';
import { useCreate } from '../../dataProvider';
import {
    useNotify,
    useRedirect,
    RedirectionSideEffect,
} from '../../sideEffect';
import {
    SetOnSuccess,
    SetOnFailure,
    TransformData,
    SetTransformData,
    useSaveModifiers,
} from '../saveModifiers';
import { useTranslate } from '../../i18n';
import { Record, OnSuccess, OnFailure, CreateParams } from '../../types';
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
    RecordType extends Omit<Record, 'id'> = Record
>(
    props: CreateControllerProps = {}
): CreateControllerResult<RecordType> => {
    const {
        disableAuthentication,
        record,
        transform,
        mutationOptions = {},
    } = props;

    useAuthenticated({ enabled: !disableAuthentication });
    const resource = useResourceContext(props);
    const { hasEdit, hasShow } = useResourceDefinition(props);
    const location = useLocation();
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const recordToUse =
        record ?? getRecordFromLocation(location) ?? emptyRecord;
    const { onSuccess, onError, ...otherMutationOptions } = mutationOptions;

    const {
        onSuccessRef,
        setOnSuccess,
        onFailureRef,
        setOnFailure,
        transformRef,
        setTransform,
    } = useSaveModifiers({ onSuccess, onFailure: onError, transform });

    const [create, { isLoading: saving }] = useCreate(
        resource,
        undefined,
        otherMutationOptions
    );

    const save = useCallback(
        (
            data: Partial<Record>,
            redirectTo = 'list',
            {
                onSuccess: onSuccessFromSave,
                onFailure: onFailureFromSave,
                transform: transformFromSave,
            } = {}
        ) =>
            Promise.resolve(
                transformFromSave
                    ? transformFromSave(data)
                    : transformRef.current
                    ? transformRef.current(data)
                    : data
            ).then(data =>
                create(
                    resource,
                    { data },
                    {
                        onSuccess: onSuccessFromSave
                            ? onSuccessFromSave
                            : onSuccessRef.current
                            ? onSuccessRef.current
                            : newRecord => {
                                  notify('ra.notification.created', {
                                      type: 'info',
                                      messageArgs: { smart_count: 1 },
                                  });
                                  redirect(
                                      redirectTo,
                                      `/${resource}`,
                                      newRecord.id,
                                      newRecord
                                  );
                              },
                        onError: onFailureFromSave
                            ? onFailureFromSave
                            : onFailureRef.current
                            ? onFailureRef.current
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
            ),
        [
            transformRef,
            create,
            onSuccessRef,
            onFailureRef,
            notify,
            redirect,
            resource,
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
        onFailureRef,
        onSuccessRef,
        transformRef,
        save,
        setOnSuccess,
        setOnFailure,
        setTransform,
        resource,
        record: recordToUse,
        redirect: getDefaultRedirectRoute(hasShow, hasEdit),
    };
};

export interface CreateControllerProps<
    RecordType extends Omit<Record, 'id'> = Record
> {
    disableAuthentication?: boolean;
    record?: Partial<RecordType>;
    resource?: string;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        CreateParams<RecordType>
    >;
    transform?: TransformData;
}

export interface CreateControllerResult<
    RecordType extends Omit<Record, 'id'> = Record
> {
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data?: RecordType;
    defaultTitle: string;
    isFetching: boolean;
    isLoading: boolean;
    onSuccessRef: MutableRefObject<OnSuccess>;
    onFailureRef: MutableRefObject<OnFailure>;
    transformRef: MutableRefObject<TransformData>;
    save: (
        record: Partial<Record>,
        redirect: RedirectionSideEffect,
        callbacks?: {
            onSuccess?: OnSuccess;
            onFailure?: OnFailure;
            transform?: TransformData;
        }
    ) => void;
    saving: boolean;
    setOnSuccess: SetOnSuccess;
    setOnFailure: SetOnFailure;
    setTransform: SetTransformData;
    record?: Partial<RecordType>;
    redirect: RedirectionSideEffect;
    resource: string;
}

const emptyRecord = {};
/**
 * Get the initial record from the location, whether it comes from the location
 * state or is serialized in the url search part.
 */
export const getRecordFromLocation = ({ state, search }: Location) => {
    if (state && state.record) {
        return state.record;
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

const getDefaultRedirectRoute = (hasShow, hasEdit) => {
    if (hasEdit) {
        return 'edit';
    }
    if (hasShow) {
        return 'show';
    }
    return 'list';
};
