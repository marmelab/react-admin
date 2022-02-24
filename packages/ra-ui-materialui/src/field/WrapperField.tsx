import * as React from 'react';
import { ReactNode } from 'react';

import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

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
export const WrapperField = ({ children }: WrapperFieldProps) => (
    <>{children}</>
);

WrapperField.displayName = 'WrapperField';

WrapperField.propTypes = fieldPropTypes;

export interface WrapperFieldProps
    extends PublicFieldProps,
        InjectedFieldProps {
    children: ReactNode;
}
