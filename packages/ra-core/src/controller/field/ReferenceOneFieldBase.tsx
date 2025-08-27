import React, { ReactNode, useMemo } from 'react';
import {
    useReferenceOneFieldController,
    UseReferenceOneFieldControllerParams,
} from './useReferenceOneFieldController';
import { useRecordContext, RecordContextProvider } from '../record';
import { ResourceContextProvider } from '../../core';
import { ReferenceFieldContextProvider } from './ReferenceFieldContext';
import { useGetPathForRecord } from '../../routing';
import type { UseReferenceFieldControllerResult } from './useReferenceFieldController';
import type { RaRecord } from '../../types';
import type { LinkToType } from '../../routing';
import { UseReferenceResult } from '../useReference';

/**
 * Render the related record in a one-to-one relationship
 *
 * Expects a single field as child
 *
 * @example // display the bio of the current author
 * <ReferenceOneFieldBase reference="bios" target="author_id">
 *     <TextField source="body" />
 * </ReferenceOneFieldBase>
 */
export const ReferenceOneFieldBase = <
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    props: ReferenceOneFieldBaseProps<RecordType, ReferenceRecordType>
) => {
    const {
        children,
        render,
        record,
        reference,
        source = 'id',
        target,
        empty,
        error,
        loading,
        sort,
        filter,
        link,
        offline,
        queryOptions,
    } = props;

    const controllerProps = useReferenceOneFieldController<
        RecordType,
        ReferenceRecordType
    >({
        record,
        reference,
        source,
        target,
        sort,
        filter,
        queryOptions,
    });

    const path = useGetPathForRecord({
        record: controllerProps.referenceRecord,
        resource: reference,
        link,
    });

    const context = useMemo<UseReferenceFieldControllerResult>(
        () => ({
            ...controllerProps,
            link: path,
        }),
        [controllerProps, path]
    );

    if (!render && !children) {
        throw new Error(
            "<ReferenceOneFieldBase> requires either a 'render' prop or 'children' prop"
        );
    }

    const recordFromContext = useRecordContext<RecordType>(props);
    const {
        error: controllerError,
        isPending,
        isPaused,
        referenceRecord,
    } = controllerProps;

    const shouldRenderLoading =
        !isPaused && isPending && loading !== false && loading !== undefined;
    const shouldRenderOffline =
        isPaused && isPending && offline !== false && offline !== undefined;
    const shouldRenderError =
        !!controllerError && error !== false && error !== undefined;
    const shouldRenderEmpty =
        (!recordFromContext ||
            (!isPaused &&
                referenceRecord == null &&
                !controllerError &&
                !isPending)) &&
        empty !== false &&
        empty !== undefined;

    return (
        <ResourceContextProvider value={reference}>
            <ReferenceFieldContextProvider value={context}>
                <RecordContextProvider value={referenceRecord}>
                    {shouldRenderLoading
                        ? loading
                        : shouldRenderOffline
                          ? offline
                          : shouldRenderError
                            ? error
                            : shouldRenderEmpty
                              ? empty
                              : render
                                ? render(controllerProps)
                                : children}
                </RecordContextProvider>
            </ReferenceFieldContextProvider>
        </ResourceContextProvider>
    );
};

export interface ReferenceOneFieldBaseProps<
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
> extends UseReferenceOneFieldControllerParams<
        RecordType,
        ReferenceRecordType
    > {
    children?: ReactNode;
    loading?: ReactNode;
    error?: ReactNode;
    empty?: ReactNode;
    offline?: ReactNode;
    render?: (props: UseReferenceResult<ReferenceRecordType>) => ReactNode;
    link?: LinkToType<ReferenceRecordType>;
    resource?: string;
}
