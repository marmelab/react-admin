export type LinkToFunctionType = <
    RecordType extends Record<string, unknown> = Record<string, unknown>
>(
    record: RecordType,
    reference: string
) => string;

export type LinkToType = string | false | LinkToFunctionType;
