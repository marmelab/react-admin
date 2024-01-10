import * as React from 'react';
import { useCallback, ReactNode } from 'react';
import get from 'lodash/get';

import { useResourceDefinition } from './useResourceDefinition';

/**
 * Get default string representation of a record
 *
 * @example // No customization
 * const getRecordRepresentation = useGetRecordRepresentation('posts');
 * getRecordRepresentation({ id: 1, title: 'Hello' }); // => "#1"
 *
 * @example // With <Resource name="posts" recordRepresentation="title" />
 * const getRecordRepresentation = useGetRecordRepresentation('posts');
 * getRecordRepresentation({ id: 1, title: 'Hello' }); // => "Hello"
 */
export const useGetRecordRepresentation = (
    resource: string
): ((record: any) => ReactNode) => {
    const { recordRepresentation } = useResourceDefinition({ resource });
    return useCallback(
        record => {
            if (!record) return '';
            if (typeof recordRepresentation === 'function') {
                return recordRepresentation(record);
            }
            if (typeof recordRepresentation === 'string') {
                return get(record, recordRepresentation);
            }
            if (React.isValidElement(recordRepresentation)) {
                return recordRepresentation;
            }
            return `#${record.id}`;
        },
        [recordRepresentation]
    );
};
