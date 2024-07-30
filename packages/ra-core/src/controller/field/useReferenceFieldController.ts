import { useMemo } from 'react';
import { UseQueryOptions } from '@tanstack/react-query';

import { RaRecord } from '../../types';
import { LinkToType, useGetPathForRecord } from '../../routing';
import { UseReferenceResult, useReference } from '../useReference';
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

    const path = useGetPathForRecord({
        record: referenceRecordQuery.referenceRecord,
        resource: reference,
        link,
    });

    const result = useMemo(
        () =>
            ({
                ...referenceRecordQuery,
                link: path,
            }) as const,
        [path, referenceRecordQuery]
    );

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
