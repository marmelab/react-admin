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
import { Offline } from '../Offline';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { useThemeProps } from '@mui/material/styles';

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
    inProps: ReferenceOneFieldProps<RecordType, ReferenceRecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        children,
        reference,
        source = 'id',
        target,
        emptyText,
        offline = defaultOffline,
        sort,
        filter,
        link,
        queryOptions,
        ...rest
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

    const empty =
        typeof emptyText === 'string' ? (
            <Typography component="span" variant="body2">
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        ) : emptyText ? (
            emptyText
        ) : null;

    if (
        !record ||
        (!controllerProps.isPending &&
            !controllerProps.isPaused &&
            controllerProps.referenceRecord == null)
    ) {
        return empty;
    }

    if (controllerProps.isPaused && controllerProps.referenceRecord == null) {
        return offline;
    }

    return (
        <ResourceContextProvider value={reference}>
            <ReferenceFieldContextProvider value={context}>
                <RecordContextProvider value={context.referenceRecord}>
                    <ReferenceFieldView
                        reference={reference}
                        source={source}
                        {...sanitizeFieldRestProps(rest)}
                    >
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
> extends Omit<FieldProps<RecordType>, 'source' | 'emptyText'> {
    children?: ReactNode;
    reference: string;
    target: string;
    sort?: SortPayload;
    source?: string;
    filter?: any;
    link?: LinkToType<ReferenceRecordType>;
    emptyText?: ReactNode;
    offline?: ReactNode;
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

const defaultOffline = <Offline variant="inline" />;

const PREFIX = 'RaReferenceOneField';

declare module '@mui/material/styles' {
    interface ComponentsPropsList {
        [PREFIX]: Partial<ReferenceOneFieldProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
        };
    }
}
