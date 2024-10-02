import { useState, useEffect } from 'react';
import { useResourceContext } from '../core/useResourceContext';
import { useRecordContext } from '../controller/record/useRecordContext';
import type { RaRecord } from '../types';
import type { LinkToType } from './types';
import { useGetPathForRecordCallback } from './useGetPathForRecordCallback';

/**
 * Get a path for a record, based on the current resource and the link type.
 *
 * Accepted link types are 'edit', 'show', a route string, false, or a function returning one of these types.
 *
 * @example
 * // basic usage (leverages RecordContext, ResourceContext and ResourceDefinitionContext)
 * const EditLink = () => {
 *   const path = useGetRouteForRecord();
 *   return path ? <Link to={path}>Edit</Link> : null;
 * };
 *
 * // controlled mode
 * const EditLink = ({ record, resource }) => {
 *    const path = useGetRouteForRecord({ record, resource, link: 'edit' });
 *    return path ? <Link to={path}>Edit</Link> : null;
 * };
 *
 * // the link option can be a function
 * const EditLink = ({ record, resource }) => {
 *   const path = useGetRouteForRecord({ record, resource, link: (record, resource) => record.canEdit ? 'edit' : false });
 *   return path ? <Link to={path}>Edit</Link> : null;
 * };
 *
 * // the link option can be a function returning a promise
 * const EditLink = ({ record, resource }) => {
 *   const path = useGetRouteForRecord({ record, resource, link: async (record, resource) => {
 *     const canEdit = await canEditRecord(record, resource);
 *     return canEdit ? 'edit' : false;
 *   }});
 *   return path ? <Link to={path}>Edit</Link> : null;
 * };
 */
export const useGetPathForRecord = <RecordType extends RaRecord = RaRecord>(
    options: UseGetPathForRecordOptions<RecordType> = {}
): string | false | undefined => {
    const { link } = options || {};
    const record = useRecordContext(options);
    const resource = useResourceContext(options);
    if (!resource) {
        throw new Error(
            'Cannot generate a link for a record without a resource. You must use useGetPathForRecord within a ResourceContextProvider, or pass a resource prop.'
        );
    }
    const getPathForRecord = useGetPathForRecordCallback<RecordType>(options);

    // we initialize the path with the link value
    const [path, setPath] = useState<string | false | undefined>();

    // update the path if the record changes
    useEffect(() => {
        const updatePath = async () => {
            const resolvedLink = await getPathForRecord({
                record,
                resource,
                link,
            });
            // update the path when the promise resolves
            setPath(resolvedLink);
        };

        updatePath();
    }, [getPathForRecord, link, record, resource]);

    return path;
};

export interface UseGetPathForRecordOptions<
    RecordType extends RaRecord = RaRecord,
> {
    resource?: string;
    record?: RecordType;
    link?: LinkToType<RecordType>;
}

export type UseGetRouteForRecordOptions<
    RecordType extends RaRecord = RaRecord,
> = UseGetPathForRecordOptions<RecordType>;
