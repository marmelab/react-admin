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
        record,
        reference,
        source = 'id',
        target,
        empty,
        sort,
        filter,
        link,
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

    const recordFromContext = useRecordContext<RecordType>(props);
    if (
        !recordFromContext ||
        (!controllerProps.isPending && controllerProps.referenceRecord == null)
    ) {
        return empty;
    }

    return (
        <ResourceContextProvider value={reference}>
            <ReferenceFieldContextProvider value={context}>
                <RecordContextProvider value={context.referenceRecord}>
                    {children}
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
    link?: LinkToType<ReferenceRecordType>;
    empty?: ReactNode;
    resource?: string;
}
