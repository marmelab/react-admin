import * as React from 'react';
import { useCallback, ReactNode } from 'react';
import inflection from 'inflection';

import { useResourceDefinition } from './useResourceDefinition';

/**
 * Get default string representation of a record
 *
 * @example
 * const getRecordRepresentation = useGetRecordRepresentation('posts');
 * getRecordRepresentation({ id: 1, title: 'Hello' }); // => "Post #1"
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
                return record[recordRepresentation];
            }
            if (React.isValidElement(recordRepresentation)) {
                return React.cloneElement(recordRepresentation);
            }
            return `${inflection.humanize(inflection.singularize(resource))} #${
                record.id
            }`;
        },
        [recordRepresentation, resource]
    );
};
