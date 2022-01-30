import { useCallback, MutableRefObject } from 'react';
// @ts-ignore
import { parse } from 'query-string';
import { Location } from 'history';
import { match as Match, useLocation } from 'react-router-dom';

import { useCheckMinimumRequiredProps } from '../checkMinimumRequiredProps';
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
import useVersion from '../useVersion';
import { CRUD_CREATE } from '../../actions';
import { Record, OnSuccess, OnFailure } from '../../types';
import { useResourceContext, useGetResourceLabel } from '../../core';

export interface CreateProps<RecordType extends Omit<Record, 'id'> = Record> {
    basePath?: string;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
    location?: Location;
    match?: Match;
    record?: Partial<RecordType>;
    resource?: string;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    transform?: TransformData;
    successMessage?: string;
}

export interface CreateControllerProps<
    RecordType extends Omit<Record, 'id'> = Record
> {
    basePath?: string;
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data?: RecordType;
    defaultTitle: string;
    loading: boolean;
    loaded: boolean;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
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
    successMessage?: string;
    record?: Partial<RecordType>;
    redirect: RedirectionSideEffect;
    resource: string;
    version: number;
}

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
    props: CreateProps
): CreateControllerProps<RecordType> => {
    useCheckMinimumRequiredProps('Create', ['basePath', 'resource'], props);
    const {
        basePath,
        hasEdit,
        hasShow,
        record = {},
        successMessage,
        onSuccess,
        onFailure,
        transform,
    } = props;

    const resource = useResourceContext(props);
    const location = useLocation();
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const recordToUse = getRecord(location, record);
    const version = useVersion();

    if (process.env.NODE_ENV !== 'production' && successMessage) {
        console.log(
            '<Create successMessage> prop is deprecated, use the onSuccess prop instead.'
        );
    }

    const {
        onSuccessRef,
        setOnSuccess,
        onFailureRef,
        setOnFailure,
        transformRef,
        setTransform,
    } = useSaveModifiers({ onSuccess, onFailure, transform });

    const [create, { loading: saving }] = useCreate(resource);

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
                    { payload: { data } },
                    {
                        action: CRUD_CREATE,
                        onSuccess: onSuccessFromSave
                            ? onSuccessFromSave
                            : onSuccessRef.current
                            ? onSuccessRef.current
                            : ({ data: newRecord }) => {
                                  notify(
                                      successMessage ||
                                          'ra.notification.created',
                                      {
                                          type: 'info',
                                          messageArgs: { smart_count: 1 },
                                      }
                                  );
                                  redirect(
                                      redirectTo,
                                      basePath,
                                      newRecord.id,
                                      newRecord
                                  );
                              },
                        onFailure: onFailureFromSave
                            ? onFailureFromSave
                            : onFailureRef.current
                            ? onFailureRef.current
                            : error => {
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
            successMessage,
            redirect,
            basePath,
        ]
    );

    const getResourceLabel = useGetResourceLabel();
    const defaultTitle = translate('ra.page.create', {
        name: getResourceLabel(resource, 1),
    });

    return {
        loading: false,
        loaded: true,
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
        basePath,
        record: recordToUse,
        redirect: getDefaultRedirectRoute(hasShow, hasEdit),
        version,
    };
};

export const getRecord = ({ state, search }, record: any = {}) => {
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
    return record;
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
