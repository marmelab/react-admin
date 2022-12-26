import * as React from 'react';
import { ReactNode } from 'react';
import { useWatch, useFormContext, FieldValues } from 'react-hook-form';
import get from 'lodash/get';

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
    const { getValues } = useFormContext();
    const formData = useWatch<TFieldValues>();

    //useWatch will initially return the provided defaultValues of the form.
    //We must get the initial formData from getValues
    if (Object.keys(formData).length === 0) {
        (formData as FieldValues) = getValues();
    }

    return (
        <FormDataConsumerView<TFieldValues> formData={formData} {...props} />
    );
};
export const FormDataConsumerView = <
    TFieldValues extends FieldValues = FieldValues,
    TPathValue = PathValue<TFieldValues, Path<TFieldValues>>[]
>(
    props: Props<TPathValue>
) => {
    const { children, form, formData, source, index, ...rest } = props;
    let ret;

    // If we have an index, we are in an iterator like component (such as the SimpleFormIterator)
    if (typeof index !== 'undefined' && source) {
        const scopedFormData = get(formData, source);
        const getSource = (scopedSource: string) => `${source}.${scopedSource}`;
        ret = children({ formData, scopedFormData, getSource, ...rest });
    } else {
        ret = children({ formData, ...rest });
    }

    return ret === undefined ? null : ret;
};

export default FormDataConsumer;
export interface FormDataConsumerRenderParams<
    TFieldValues extends FieldValues = FieldValues
> {
    formData: TFieldValues;
    scopedFormData?: any;
    getSource?: (source: string) => string;
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
