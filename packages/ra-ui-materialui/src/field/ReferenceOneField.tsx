import React, { ReactElement, ReactNode } from 'react';
import { UseQueryOptions } from '@tanstack/react-query';
import { Typography } from '@mui/material';
import {
    LinkToType,
    useTranslate,
    SortPayload,
    RaRecord,
    ReferenceOneFieldBase,
    UseReferenceResult,
} from 'ra-core';

import { FieldProps } from './types';
import { ReferenceFieldView } from './ReferenceField';
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
        render,
        reference,
        source = 'id',
        target,
        emptyText,
        empty,
        sort,
        filter,
        link,
        queryOptions,
        ...rest
    } = props;
    const translate = useTranslate();

    return (
        <ReferenceOneFieldBase
            {...props}
            empty={
                emptyText ? (
                    typeof emptyText === 'string' ? (
                        <Typography component="span" variant="body2">
                            {emptyText &&
                                translate(emptyText, { _: emptyText })}
                        </Typography>
                    ) : (
                        emptyText
                    )
                ) : typeof empty === 'string' ? (
                    <Typography component="span" variant="body2">
                        {empty && translate(empty, { _: empty })}
                    </Typography>
                ) : (
                    empty ?? null
                )
            }
        >
            <ReferenceFieldView
                reference={reference}
                source={source}
                render={render}
                {...sanitizeFieldRestProps(rest)}
            >
                {children}
            </ReferenceFieldView>
        </ReferenceOneFieldBase>
    );
};

export interface ReferenceOneFieldProps<
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
> extends Omit<FieldProps<RecordType>, 'source' | 'emptyText'> {
    children?: ReactNode;
    render?: (record: UseReferenceResult<ReferenceRecordType>) => ReactElement;
    reference: string;
    target: string;
    sort?: SortPayload;
    source?: string;
    filter?: any;
    link?: LinkToType<ReferenceRecordType>;
    /**
     * @deprecated Use the empty prop instead
     */
    emptyText?: string | ReactElement;
    empty?: ReactNode;
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
