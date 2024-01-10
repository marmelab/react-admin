import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { UseQueryOptions } from 'react-query';
import { Typography } from '@mui/material';
import {
    useReferenceOneFieldController,
    useRecordContext,
    ResourceContextProvider,
    LinkToType,
    useCreatePath,
    useTranslate,
    SortPayload,
    RaRecord,
} from 'ra-core';

import { fieldPropTypes, FieldProps } from './types';
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
    ReferenceRecordType extends RaRecord = RaRecord
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
        link = false,
        queryOptions,
    } = props;
    const record = useRecordContext<RecordType>(props);
    const createPath = useCreatePath();
    const translate = useTranslate();

    const {
        isLoading,
        isFetching,
        referenceRecord,
        error,
        refetch,
    } = useReferenceOneFieldController<ReferenceRecordType>({
        record,
        reference,
        source,
        target,
        sort,
        filter,
        queryOptions,
    });

    const resourceLinkPath =
        link === false
            ? false
            : createPath({
                  resource: reference,
                  id: referenceRecord?.id,
                  type:
                      typeof link === 'function'
                          ? link(record, reference)
                          : link,
              });

    return !record || (!isLoading && referenceRecord == null) ? (
        emptyText ? (
            <Typography component="span" variant="body2">
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        ) : null
    ) : (
        <ResourceContextProvider value={reference}>
            <ReferenceFieldView
                isLoading={isLoading}
                isFetching={isFetching}
                referenceRecord={referenceRecord}
                resourceLinkPath={resourceLinkPath}
                reference={reference}
                refetch={refetch}
                error={error}
            >
                {children}
            </ReferenceFieldView>
        </ResourceContextProvider>
    );
};

export interface ReferenceOneFieldProps<
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord
> extends FieldProps<RecordType> {
    children?: ReactNode;
    reference: string;
    target: string;
    sort?: SortPayload;
    filter?: any;
    link?: LinkToType<RecordType>;
    queryOptions?: UseQueryOptions<{
        data: ReferenceRecordType[];
        total: number;
    }> & { meta?: any };
}

ReferenceOneField.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    label: fieldPropTypes.label,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    source: PropTypes.string,
    target: PropTypes.string.isRequired,
    queryOptions: PropTypes.any,
};

ReferenceOneField.defaultProps = {
    // disable sorting on this field by default as its default source prop ('id')
    // will match the default sort ({ field: 'id', order: 'DESC'})
    // leading to an incorrect sort indicator in a datagrid header
    sortable: false,
};
