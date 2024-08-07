import { useCallback } from 'react';
import { useResourceContext, useResourceDefinitions } from '../core';
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

export interface UseGetPathForRecordCallbackOptions {
    resource?: string;
}
