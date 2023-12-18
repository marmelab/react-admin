import * as React from 'react';
import { ReactNode } from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';
import get from 'lodash/get';
import { useFormValues } from './useFormValues';
import { useSourcePrefix } from '../core';

/**
 * Get the current (edited) value of the record from the form and pass it
 * to a child function
 *
 * @example
 *
 * const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm<FieldValues>>
 *             <BooleanInput source="hasEmail" />
 *             <FormDataConsumer>
 *                 {({ formData, ...rest }) => formData.hasEmail &&
 *                      <TextInput source="email" {...rest} />
 *                 }
 *             </FormDataConsumer>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example
 *
 * const OrderEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <SelectInput source="country" choices={countries} />
 *             <FormDataConsumer<FieldValues>>
 *                 {({ formData, ...rest }) =>
 *                      <SelectInput
 *                          source="city"
 *                          choices={getCitiesFor(formData.country)}
 *                          {...rest}
 *                      />
 *                 }
 *             </FormDataConsumer>
 *         </SimpleForm>
 *     </Edit>
 * );
 */
const FormDataConsumer = <TFieldValues extends FieldValues = FieldValues>(
    props: ConnectedProps<TFieldValues>
) => {
    const form = useFormContext<TFieldValues>();
    const {
        formState: {
            // Don't know exactly why, but this is needed for the form values to be updated
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isDirty,
        },
    } = form;
    const formData = useFormValues<TFieldValues>();
    return (
        <FormDataConsumerView<TFieldValues> formData={formData} {...props} />
    );
};

export const FormDataConsumerView = <
    TFieldValues extends FieldValues = FieldValues
>(
    props: Props<TFieldValues>
) => {
    const { children, form, formData, source, ...rest } = props;
    let ret;

    const prefix = useSourcePrefix();
    const matches = ArraySourceRegex.exec(prefix);

    // If we have an index, we are in an iterator like component (such as the SimpleFormIterator)
    if (matches && prefix) {
        const scopedFormData = get(formData, prefix);
        // Not needed anymore. Kept to avoid breaking existing code
        const getSource = (scopedSource: string) => scopedSource;
        ret = children({ formData, scopedFormData, getSource, ...rest });
    } else {
        ret = children({
            formData,
            getSource: (scopedSource: string) => scopedSource,
            ...rest,
        });
    }

    return ret === undefined ? null : ret;
};

export default FormDataConsumer;

const ArraySourceRegex = new RegExp(/.+\.\d+$/);

export interface FormDataConsumerRenderParams<
    TFieldValues extends FieldValues = FieldValues,
    TScopedFieldValues extends FieldValues = TFieldValues
> {
    formData: TFieldValues;
    scopedFormData?: TScopedFieldValues;
    getSource: (source: string) => string;
}

export type FormDataConsumerRender<
    TFieldValues extends FieldValues = FieldValues
> = (params: FormDataConsumerRenderParams<TFieldValues>) => ReactNode;

interface ConnectedProps<TFieldValues extends FieldValues = FieldValues> {
    children: FormDataConsumerRender<TFieldValues>;
    form?: string;
    record?: any;
    source?: string;
    [key: string]: any;
}

interface Props<TFieldValues extends FieldValues> extends ConnectedProps {
    formData: TFieldValues;
    index?: number;
}
