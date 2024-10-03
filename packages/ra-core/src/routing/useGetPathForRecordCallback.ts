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

            if (record == null || link === false) {
                return false;
            }

            // When the link prop is not provided, we infer a default value and check whether users
            // can access it
            if (link == null) {
                // check if the user can access the show and edit pages in parallel
                const [canAccessShow, canAccessEdit] = await Promise.all([
                    resourceDefinition.hasShow
                        ? canAccess({
                              action: 'show',
                              resource: finalResource,
                              record,
                          })
                        : Promise.resolve(false),
                    resourceDefinition.hasEdit
                        ? canAccess({
                              action: 'edit',
                              resource: finalResource,
                              record,
                          })
                        : Promise.resolve(false),
                ]);

                if (canAccessShow) {
                    return createPath({
                        resource: finalResource,
                        id: record.id,
                        type: 'show',
                    });
                }
                if (canAccessEdit) {
                    return createPath({
                        resource: finalResource,
                        id: record.id,
                        type: 'edit',
                    });
                }
                return false;
            }

            const linkFunc = typeof link === 'function' ? link : () => link;
            const linkResult = linkFunc(record, finalResource);
            if (linkResult === false) {
                return false;
            }

            const linkResultIsPromise = isPromise(linkResult);

            if (linkResultIsPromise) {
                const resolvedLink = await linkResult;
                if (resolvedLink === false) {
                    // already set to false by default
                    return;
                }
                return createPath({
                    resource: finalResource,
                    id: record.id,
                    type: resolvedLink,
                });
            }

            return createPath({
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
