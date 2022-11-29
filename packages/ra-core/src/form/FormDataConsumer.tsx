import * as React from 'react';
import { ReactNode } from 'react';
import { useWatch, useFormContext, FieldValues } from 'react-hook-form';
import get from 'lodash/get';

import warning from '../util/warning';
/**
 * Get the current (edited) value of the record from the form and pass it
 * to a child function
 *
 * @example
 *
 * const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
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
 *             <FormDataConsumer>
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
const FormDataConsumer = (props: ConnectedProps) => {
    const { getValues } = useFormContext();
    let formData = useWatch();

    //useWatch will initially return the provided defaultValues of the form.
    //We must get the initial formData from getValues
    if (Object.keys(formData).length === 0) {
        (formData as FieldValues) = getValues();
    }

    return <FormDataConsumerView formData={formData} {...props} />;
};

export const FormDataConsumerView = (props: Props) => {
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

export interface FormDataConsumerRenderParams {
    formData: any;
    scopedFormData?: any;
    getSource?: (source: string) => string;
}

export type FormDataConsumerRender = (
    params: FormDataConsumerRenderParams
) => ReactNode;

interface ConnectedProps {
    children: FormDataConsumerRender;
    form?: string;
    record?: any;
    source?: string;
    [key: string]: any;
}

interface Props extends ConnectedProps {
    formData: any;
    index?: number;
}
