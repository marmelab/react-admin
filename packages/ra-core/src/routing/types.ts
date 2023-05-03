export type LinkToFunctionType<
    RecordType extends Record<string, unknown> = Record<string, any>
> = (record: RecordType, reference: string) => string;

export type LinkToType<
    RecordType extends Record<string, unknown> = Record<string, any>
> = string | false | LinkToFunctionType<RecordType>;
