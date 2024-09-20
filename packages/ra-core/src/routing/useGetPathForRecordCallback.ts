import { useCallback } from 'react';
import { useResourceContext } from '../core/useResourceContext';
import { useResourceDefinitions } from '../core/useResourceDefinitions';
import { useCanAccessCallback } from '../auth/useCanAccessCallback';
import type { RaRecord } from '../types';
import { useCreatePath } from './useCreatePath';
import { UseGetRouteForRecordOptions } from './useGetPathForRecord';

export const useGetPathForRecordCallback = <
    RecordType extends RaRecord = RaRecord,
>(
    options: UseGetPathForRecordCallbackOptions = {}
) => {
    const resource = useResourceContext(options);
    const resourceDefinitions = useResourceDefinitions();
    const createPath = useCreatePath();
    const canAccess = useCanAccessCallback();

    return useCallback(
        async (params: UseGetRouteForRecordOptions<RecordType>) => {
            const { link, record } = params || {};
            const finalResource = params.resource ?? resource;
            if (!finalResource) {
                throw new Error(
                    'Cannot generate a link for a record without a resource. You must use useGetPathForRecordCallback within a ResourceContextProvider, or pass a resource parameter.'
                );
            }
            const resourceDefinition = resourceDefinitions[finalResource] ?? {};
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
                const resolvedLink = await linkResult;
                if (resolvedLink === false) {
                    // already set to false by default
                    return;
                }
                if (['edit', 'show'].includes(resolvedLink)) {
                    if (
                        !(await canAccess({
                            action: resolvedLink,
                            resource: finalResource,
                            record,
                        }))
                    ) {
                        return false;
                    }
                }
                return createPath({
                    resource: finalResource,
                    id: record.id,
                    type: resolvedLink,
                });
            }

            if (linkResult !== false && ['edit', 'show'].includes(linkResult)) {
                if (
                    !(await canAccess({
                        action: linkResult,
                        resource: finalResource,
                        record,
                    }))
                ) {
                    return false;
                }
            }

            return linkResult === false || linkResultIsPromise
                ? false
                : createPath({
                      resource: finalResource,
                      id: record.id,
                      type: linkResult,
                  });
        },
        [canAccess, createPath, resourceDefinitions, resource]
    );
};

const isPromise = (value: any): value is Promise<any> =>
    value && typeof value.then === 'function';

export interface UseGetPathForRecordCallbackOptions {
    resource?: string;
}
