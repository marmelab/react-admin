import { Identifier, RaRecord } from '../types';

export type RowClickFunctionBase<RecordType extends RaRecord = RaRecord> = (
    id: Identifier,
    resource: string,
    record: RecordType
) => string | false | Promise<string | false>;
