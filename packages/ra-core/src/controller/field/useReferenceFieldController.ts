import { useMemo } from 'react';
import { UseQueryOptions } from '@tanstack/react-query';
import { RaRecord } from '../../types';
import { LinkToType, useCreatePath } from '../../routing';
import { UseReferenceResult, useReference } from '../useReference';
import { useResourceDefinition } from '../../core';
import { useFieldValue } from '../../util';

export const useReferenceFieldController = <
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    options: UseReferenceFieldControllerOptions<ReferenceRecordType>
): UseReferenceFieldControllerResult<ReferenceRecordType> => {
    const { link, reference, queryOptions } = options;
    if (!reference) {
        throw new Error(
            'useReferenceFieldController: missing reference prop. You must provide a reference, e.g. reference="posts".'
        );
    }
    const id = useFieldValue(options);
    const referenceRecordQuery = useReference<ReferenceRecordType>({
        reference,
        id,
        options: {
            ...queryOptions,
            enabled:
                (queryOptions?.enabled == null ||
                    queryOptions?.enabled === true) &&
                id != null,
        },
    });

    const createPath = useCreatePath();
    const resourceDefinition = useResourceDefinition({ resource: reference });

    const result = useMemo(() => {
        const defaultLink = resourceDefinition.hasEdit
            ? 'edit'
            : resourceDefinition.hasShow
              ? 'show'
              : false;
        const isLinkFalse =
            link === false || (link == null && defaultLink === false);
        const linkString =
            referenceRecordQuery.referenceRecord == null || isLinkFalse
                ? false
                : createPath({
                      resource: reference,
                      id: referenceRecordQuery.referenceRecord.id,
                      // @ts-ignore TypeScript doesn't understand that type cannot be false here
                      type:
                          typeof link === 'function'
                              ? link(
                                    referenceRecordQuery.referenceRecord,
                                    reference
                                )
                              : link ?? defaultLink,
                  });
        return {
            ...referenceRecordQuery,
            link: linkString,
        } as const;
    }, [createPath, link, reference, referenceRecordQuery, resourceDefinition]);
    return result;
};

export interface UseReferenceFieldControllerOptions<
    ReferenceRecordType extends RaRecord = RaRecord,
> {
    source: string;
    queryOptions?: Partial<
        UseQueryOptions<ReferenceRecordType[], Error> & {
            meta?: any;
        }
    >;
    reference: string;
    link?: LinkToType<ReferenceRecordType>;
}

export interface UseReferenceFieldControllerResult<
    ReferenceRecordType extends RaRecord = RaRecord,
> extends UseReferenceResult<ReferenceRecordType> {
    link?: string | false;
}
