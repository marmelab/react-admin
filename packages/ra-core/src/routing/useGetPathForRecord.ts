import { useState, useEffect } from 'react';
import { useResourceContext } from '../core/useResourceContext';
import { useRecordContext } from '../controller/record/useRecordContext';
import type { RaRecord } from '../types';
import type { LinkToType } from './types';
import { useCanAccess } from '../auth';
import { useResourceDefinition } from '../core';
import { useCreatePath } from './useCreatePath';

/**
 * Get a path for a record, based on the current resource and the link type.
 *
 * Accepted link types are 'edit', 'show', a route string, false, or a function returning one of these types.
 *
 * @example
 * // basic usage (leverages RecordContext, ResourceContext and ResourceDefinitionContext)
 * const EditLink = () => {
 *   const path = useGetPathForRecord();
 *   return path ? <Link to={path}>Edit</Link> : null;
 * };
 *
 * // controlled mode
 * const EditLink = ({ record, resource }) => {
 *    const path = useGetPathForRecord({ record, resource, link: 'edit' });
 *    return path ? <Link to={path}>Edit</Link> : null;
 * };
 *
 * // the link option can be a function
 * const EditLink = ({ record, resource }) => {
 *   const path = useGetPathForRecord({ record, resource, link: (record, resource) => record.canEdit ? 'edit' : false });
 *   return path ? <Link to={path}>Edit</Link> : null;
 * };
 *
 * // the link option can be a function returning a promise
 * const EditLink = ({ record, resource }) => {
 *   const path = useGetPathForRecord({ record, resource, link: async (record, resource) => {
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
    const resourceDefinition = useResourceDefinition(options);
    const createPath = useCreatePath();
    const [path, setPath] = useState<string | false>(
        link && typeof link !== 'function' && record != null
            ? createPath({
                  resource,
                  id: record.id,
                  type: link,
              })
            : false
    );

    // in preparation for the default value, does the user have access to the show and edit pages?
    // (we can't run hooks conditionally, so we need to run them even though the link is specified)
    const { canAccess: canAccessShow } = useCanAccess({
        action: 'show',
        resource,
        record,
        enabled: link == null && resourceDefinition.hasShow,
    });
    const { canAccess: canAccessEdit } = useCanAccess({
        action: 'edit',
        resource,
        record,
        enabled: link == null && resourceDefinition.hasEdit,
    });

    useEffect(() => {
        if (!record) return;

        // Handle the inferred link type case
        if (link == null) {
            // We must check whether the resource has an edit view because if there is no
            // authProvider, canAccessShow will always be true
            if (resourceDefinition.hasShow && canAccessShow) {
                setPath(
                    createPath({
                        resource,
                        id: record.id,
                        type: 'show',
                    })
                );
                return;
            }
            // We must check whether the resource has an edit view because if there is no
            // authProvider, canAccessEdit will always be true
            if (resourceDefinition.hasEdit && canAccessEdit) {
                setPath(
                    createPath({
                        resource,
                        id: record.id,
                        type: 'edit',
                    })
                );
                return;
            }
        }

        // Handle the link function case
        if (typeof link === 'function') {
            const linkResult = link(record, resource);
            if (linkResult instanceof Promise) {
                linkResult.then(resolvedPath => setPath(resolvedPath));
                return;
            }
            setPath(
                linkResult
                    ? createPath({
                          resource,
                          id: record.id,
                          type: linkResult,
                      })
                    : false
            );
            return;
        }

        // handle string case
        if (link) {
            setPath(
                createPath({
                    resource,
                    id: record.id,
                    type: link,
                })
            );
        }
    }, [
        createPath,
        canAccessShow,
        canAccessEdit,
        link,
        record,
        resource,
        resourceDefinition.hasEdit,
        resourceDefinition.hasShow,
    ]);

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
