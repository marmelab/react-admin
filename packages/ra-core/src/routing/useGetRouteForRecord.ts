import { useResourceContext, useResourceDefinition } from '../core';
import { useCreatePath } from './useCreatePath';
import { useRecordContext } from '../controller';
import type { RaRecord } from '../types';
import type { LinkToType } from './types';

export const useGetRouteForRecord = <RecordType extends RaRecord = RaRecord>(
    options: UseGetRouteForRecordOptions<RecordType>
): string | false | undefined => {
    const { link } = options;
    const record = useRecordContext(options);
    const resource = useResourceContext(options);
    if (!resource) {
        throw new Error(
            'Cannot generate a link for a record without a resource. You must use useGetRouteForRecord within a ResourceContextProvider, or pass a resource prop.'
        );
    }
    const createPath = useCreatePath();
    const resourceDefinition = useResourceDefinition({ resource });

    const defaultLink = resourceDefinition.hasEdit
        ? 'edit'
        : resourceDefinition.hasShow
          ? 'show'
          : false;

    const isLinkFalse =
        link === false || (link == null && defaultLink === false);

    if (record == null || isLinkFalse) return false;

    return createPath({
        resource,
        id: record.id,
        // @ts-ignore TypeScript doesn't understand that type cannot be false here
        type:
            typeof link === 'function'
                ? link(record, resource)
                : link ?? defaultLink,
    });
};

export interface UseGetRouteForRecordOptions<
    RecordType extends RaRecord = RaRecord,
> {
    resource?: string;
    record?: RecordType;
    link?: LinkToType<RecordType>;
}
