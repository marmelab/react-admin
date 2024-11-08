import get from 'lodash/get';
import { useRecordContext } from '../controller';
import { ExtractRecordPaths } from '../types';

/**
 * A hook that gets the value of a field of the current record.
 * @param params The hook parameters
 * @param params.source The field source
 * @param params.record The record to use. Uses the record from the RecordContext if not provided
 * @param params.defaultValue The value to return when the field value is empty
 * @returns The field value
 *
 * @example
 * const MyField = (props: { source: string }) => {
 *   const value = useFieldValue(props);
 *   return <span>{value}</span>;
 * }
 */
export const useFieldValue = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    params: UseFieldValueOptions<RecordType>
) => {
    const { defaultValue, source } = params;
    // We use the record from the RecordContext and do not rely on the SourceContext on purpose to
    // avoid having the wrong source targeting the record.
    // Indeed, some components may create a sub record context (SimpleFormIterator, TranslatableInputs, etc.). In this case,
    // it they used the SourceContext as well, they would have the wrong source.
    // Inputs needs the SourceContext as they rely on the Form value and you can't have nested forms.
    // Fields needs the RecordContext as they rely on the Record value and you can have nested RecordContext.
    const record = useRecordContext<RecordType>(params);

    return get(record, source, defaultValue);
};

export interface UseFieldValueOptions<
    RecordType extends Record<string, any> = Record<string, any>,
> {
    // FIXME: Find a way to throw a type error when defaultValue is not of RecordType[Source] type
    defaultValue?: any;
    source: ExtractRecordPaths<RecordType>;
    record?: RecordType;
}
