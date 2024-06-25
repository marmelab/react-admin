import { RaRecord } from '../types';

export type LinkToFunctionType<RecordType extends RaRecord = RaRecord> = (
    record: RecordType,
    reference: string
) => string | false | Promise<string | false>;

export type LinkToType<RecordType extends RaRecord = RaRecord> =
    | string
    | false
    | LinkToFunctionType<RecordType>;
