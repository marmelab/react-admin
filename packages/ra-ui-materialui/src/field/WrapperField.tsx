import * as React from 'react';
import { ReactNode } from 'react';

import { FieldProps, fieldPropTypes } from './types';

/**
 * A field rendering its children.
 *
 * Designed as a wrapper for several fields, to support props read by
 * the parent element (e.g. `<SimpleShowLayout>`, `<Datagrid`).
 *
 * @example
 * import { WrapperField, TextField } from 'react-admin';
 *
 * const PostShow = () => (
 *    <Show>
 *        <SimpleShowLayout>
 *            <WrapperField label="author" sortBy="last_name">
 *               <TextField source="first_name" />
 *               <TextField source="last_name" />
 *            </WrapperField>
 *       </SimpleShowLayout>
 *   </Show>
 * );
 */
export const WrapperField = <
    RecordType extends Record<string, any> = Record<string, any>
>({
    children,
}: WrapperFieldProps<RecordType>) => <>{children}</>;

WrapperField.displayName = 'WrapperField';

WrapperField.propTypes = fieldPropTypes;

export interface WrapperFieldProps<
    RecordType extends Record<string, any> = Record<string, any>
> extends FieldProps<RecordType> {
    children: ReactNode;
}
