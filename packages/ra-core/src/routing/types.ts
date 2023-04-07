export type LinkToFunctionType = <RecordType extends any = unknown>(
    record: RecordType,
    reference: string
) => string;

export type LinkToType = string | false | LinkToFunctionType;
