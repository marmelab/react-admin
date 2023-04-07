import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { UseQueryOptions } from 'react-query';
import { Typography } from '@mui/material';
import { Call, Objects } from 'hotscript';
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

import { PublicFieldProps, fieldPropTypes, InjectedFieldProps } from './types';
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
    ReferenceType extends RaRecord = any,
    RecordType extends RaRecord = any
>(
    props: ReferenceOneFieldProps<ReferenceType, RecordType>
) => {
    const {
        children,
        reference,
        source,
        target,
        emptyText,
        sort,
        filter,
        link = false,
        queryOptions,
    } = props;
    const record = useRecordContext(props);
    const createPath = useCreatePath();
    const translate = useTranslate();

    const {
        isLoading,
        isFetching,
        referenceRecord,
        error,
        refetch,
    } = useReferenceOneFieldController<ReferenceType>({
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
    ReferenceType extends RaRecord = any,
    RecordType extends RaRecord = any
> extends PublicFieldProps,
        InjectedFieldProps<RecordType> {
    children?: ReactNode;
    reference: string;
    sort?: SortPayload;
    filter?: any;
    link?: LinkToType;
    queryOptions?: UseQueryOptions<{
        data: ReferenceType[];
        total: number;
    }> & { meta?: any };
    target: unknown extends ReferenceType
        ? string
        : Call<Objects.AllPaths, ReferenceType>;
    source?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
    sortBy?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
}

ReferenceOneField.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    label: fieldPropTypes.label,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    queryOptions: PropTypes.any,
};

ReferenceOneField.defaultProps = {
    source: 'id',
};
