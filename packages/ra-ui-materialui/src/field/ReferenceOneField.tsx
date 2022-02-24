import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import {
    useReferenceOneFieldController,
    useRecordContext,
    ResourceContextProvider,
    LinkToType,
    useCreatePath,
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
export const ReferenceOneField = (props: ReferenceOneFieldProps) => {
    const {
        children,
        reference,
        source,
        target,
        emptyText,
        link = false,
    } = props;
    const record = useRecordContext(props);
    const createPath = useCreatePath();

    const {
        isLoading,
        isFetching,
        referenceRecord,
        error,
        refetch,
    } = useReferenceOneFieldController({
        record,
        reference,
        source,
        target,
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
                {emptyText}
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

export interface ReferenceOneFieldProps
    extends PublicFieldProps,
        InjectedFieldProps {
    children: ReactElement;
    reference: string;
    target: string;
    link?: LinkToType;
}

ReferenceOneField.propTypes = {
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    label: fieldPropTypes.label,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
};

ReferenceOneField.defaultProps = {
    source: 'id',
};
