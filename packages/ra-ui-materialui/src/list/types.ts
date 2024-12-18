import { Identifier, RaRecord } from 'ra-core';

export type RowClickFunction = <RecordType extends RaRecord = RaRecord>(
    id: Identifier,
    resource: string,
    record: RecordType
) => string | false | Promise<string | false>;
