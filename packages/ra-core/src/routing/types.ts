import { RaRecord } from '../types';

export type LinkToFunctionType = (
    record: RaRecord,
    reference: string
) => string;

export type LinkToType = string | false | LinkToFunctionType;
