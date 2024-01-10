import { RaRecord } from '../types';

export type LinkToFunctionType<RecordType extends RaRecord = RaRecord> = (
    record: RecordType,
    reference: string
) => string;

export type LinkToType<RecordType extends RaRecord = RaRecord> =
    | string
    | false
    | LinkToFunctionType<RecordType>;
