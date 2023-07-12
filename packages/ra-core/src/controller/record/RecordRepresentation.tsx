import * as React from 'react';
import { useGetRecordRepresentation, useResourceContext } from '../../core';
import { RaRecord } from '../../types';
import { useRecordContext } from './useRecordContext';

/**
 * Render the record representation as specified on its parent <Resource>.
 * @param props The component props
 * @param {string} props.resource The resource name
 * @param {RaRecord} props.record The record to render
 */
export const RecordRepresentation = (props: {
    record?: RaRecord;
    resource?: string;
}) => {
    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    const getRecordRepresentation = useGetRecordRepresentation(resource);

    return <>{getRecordRepresentation(record)}</>;
};
