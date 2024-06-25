import React, { ReactNode, useMemo } from 'react';
import { UseQueryOptions } from '@tanstack/react-query';
import { Typography } from '@mui/material';
import {
    useReferenceOneFieldController,
    useRecordContext,
    ResourceContextProvider,
    LinkToType,
    useGetPathForRecord,
    useTranslate,
    SortPayload,
    RaRecord,
    RecordContextProvider,
    ReferenceFieldContextProvider,
    UseReferenceFieldControllerResult,
} from 'ra-core';

import { FieldProps } from './types';
import { ReferenceFieldView } from './ReferenceField';

/**
 * Render the related record in a one-to-one relationship
 *
 * Expects a single field as child
 *
 * @example // display the bio of the current author
 * <ReferenceOneField reference="bios" target="author_id">
 *     <TextField source="body" />
 * </ReferenceOneField>
 */
export const ReferenceOneField = <
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    props: ReferenceOneFieldProps<RecordType, ReferenceRecordType>
) => {
    const {
        children,
        reference,
        source = 'id',
        target,
        emptyText,
        sort,
        filter,
        link,
        queryOptions,
    } = props;
    const record = useRecordContext<RecordType>(props);
    const translate = useTranslate();

    const controllerProps = useReferenceOneFieldController<ReferenceRecordType>(
        {
            record,
            reference,
            source,
            target,
            sort,
            filter,
            queryOptions,
        }
    );

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
    return !record ||
        (!controllerProps.isPending &&
            controllerProps.referenceRecord == null) ? (
        emptyText ? (
            <Typography component="span" variant="body2">
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        ) : null
    ) : (
        <ResourceContextProvider value={reference}>
            <ReferenceFieldContextProvider value={context}>
                <RecordContextProvider value={context.referenceRecord}>
                    <ReferenceFieldView reference={reference} source={source}>
                        {children}
                    </ReferenceFieldView>
                </RecordContextProvider>
            </ReferenceFieldContextProvider>
        </ResourceContextProvider>
    );
};

export interface ReferenceOneFieldProps<
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
> extends Omit<FieldProps<RecordType>, 'source'> {
    children?: ReactNode;
    reference: string;
    target: string;
    sort?: SortPayload;
    source?: string;
    filter?: any;
    link?: LinkToType<ReferenceRecordType>;
    queryOptions?: Omit<
        UseQueryOptions<{
            data: ReferenceRecordType[];
            total: number;
        }>,
        'queryKey'
    > & { meta?: any };
}

// disable sorting on this field by default as its default source prop ('id')
// will match the default sort ({ field: 'id', order: 'DESC'})
// leading to an incorrect sort indicator in a datagrid header
ReferenceOneField.sortable = false;
