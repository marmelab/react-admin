import { useParams } from 'react-router-dom';
import { useRecordContext } from '../controller';
import { Identifier, RaRecord } from '../types';

/**
 * Helper hook to get the current `recordId`.
 *
 * `recordId` is obtained from parameters if passed as a parameter, or from the `RecordContext` if there is one, or, lastly, from the react-router URL.
 *
 * @param {any} recordId optional if used inside a RecordContextProvider or if recordId can be guessed from the URL
 *
 * @returns The `recordId` determined in this manner.
 *
 * @example
 * const recordId = useGetRecordId();
 */
export function useGetRecordId(recordId?: Identifier): Identifier {
    const contextRecord = useRecordContext<RaRecord>();
    const { id: routeId } = useParams<'id'>();
    const actualRecordId = recordId ?? contextRecord?.id ?? routeId;
    if (actualRecordId == null)
        throw new Error(
            `useGetRecordId could not find the current record id. You need to use it inside a RecordContextProvider, or inside a supported route, or provide the record id to the hook yourself.`
        );

    return actualRecordId;
}
