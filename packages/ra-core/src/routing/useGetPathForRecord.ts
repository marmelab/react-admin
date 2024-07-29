import { useState, useEffect, useCallback } from 'react';
import { useResourceContext, useResourceDefinitions } from '../core';
import { useCreatePath } from './useCreatePath';
import { useRecordContext } from '../controller';
import type { RaRecord } from '../types';
import type { LinkToType } from './types';

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
    options: UseGetRouteForRecordOptions<RecordType>
): string | false | undefined => {
    const { link } = options || {};
    const record = useRecordContext(options);
    const resource = useResourceContext(options);
    if (!resource) {
        throw new Error(
            'Cannot generate a link for a record without a resource. You must use useGetRouteForRecord within a ResourceContextProvider, or pass a resource prop.'
        );
    }
    const getPathForRecord = useGetRouteForRecordCallback<RecordType>(options);

    // we initialize the path with the link value
    const [path, setPath] = useState<string | false | undefined>(() => {
        getPathForRecord({
            record,
            resource,
            link,
        }).then(resolvedLink => {
            if (resolvedLink === false) {
                // already set to false by default
                return;
            }
            // update the path when the promise resolves
            setPath(resolvedLink);
        });

        return false;
    });

    // update the path if the record changes
    useEffect(() => {
        getPathForRecord({
            record,
            resource,
            link,
        }).then(resolvedLink => {
            // update the path when the promise resolves
            setPath(resolvedLink);
        });
    }, [getPathForRecord, link, record, resource]);

    return path;
};

export const useGetRouteForRecordCallback = <
    RecordType extends RaRecord = RaRecord,
>(
    options: UseGetRouteForRecordCallbackOptions = {}
) => {
    const resource = useResourceContext(options);
    const resourceDefinitions = useResourceDefinitions();
    const createPath = useCreatePath();

    return useCallback(
        async (params: UseGetRouteForRecordOptions<RecordType>) => {
            const { link, record } = params || {};
            const finalResource = params.resource ?? resource;
            if (!finalResource) {
                throw new Error(
                    'Cannot generate a link for a record without a resource. You must use useGetRouteForRecordCallback within a ResourceContextProvider, or pass a resource parameter.'
                );
            }
            const resourceDefinition = resourceDefinitions[finalResource] ?? {};

            // eslint-disable-next-line react-hooks/exhaustive-deps
            const linkFunc = typeof link === 'function' ? link : () => link;

            const defaultLink = resourceDefinition.hasShow
                ? 'show'
                : resourceDefinition.hasEdit
                  ? 'edit'
                  : false;

            const isLinkFalse =
                link === false || (link == null && defaultLink === false);

            if (record == null || isLinkFalse) {
                return false;
            }
            const linkResult = linkFunc(record, finalResource) ?? defaultLink;
            const linkResultIsPromise = isPromise(linkResult);

            if (linkResultIsPromise) {
                return linkResult.then(resolvedLink => {
                    if (resolvedLink === false) {
                        // already set to false by default
                        return;
                    }
                    return createPath({
                        resource: finalResource,
                        id: record.id,
                        type: resolvedLink,
                    });
                });
            }

            return linkResult === false || linkResultIsPromise
                ? false
                : createPath({
                      resource: finalResource,
                      id: record.id,
                      type: linkResult,
                  });
        },
        [createPath, resourceDefinitions, resource]
    );
};

const isPromise = (value: any): value is Promise<any> =>
    value && typeof value.then === 'function';

export interface UseGetRouteForRecordCallbackOptions {
    resource?: string;
}

export interface UseGetRouteForRecordOptions<
    RecordType extends RaRecord = RaRecord,
> {
    resource?: string;
    record?: RecordType;
    link?: LinkToType<RecordType>;
}
