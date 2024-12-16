import * as React from 'react';
import { ReactNode } from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';
import get from 'lodash/get';
import { useFormValues } from './useFormValues';
import { useWrappedSource } from '../core';
import { useEvent } from '../util';

/**
 * Get the current (edited) value of the record from the form and pass it
 * to a child function
 *
 * @example
 *
 * const PostEdit = () => (
 *     <Edit>
 *         <SimpleForm<FieldValues>>
 *             <BooleanInput source="hasEmail" />
 *             <FormDataConsumer>
 *                 {({ formData }) => formData.hasEmail &&
 *                      <TextInput source="email" />
 *                 }
 *             </FormDataConsumer>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example
 *
 * const OrderEdit = () => (
 *     <Edit>
 *         <SimpleForm>
 *             <SelectInput source="country" choices={countries} />
 *             <FormDataConsumer<FieldValues>>
 *                 {({ formData }) =>
 *                      <SelectInput
 *                          source="city"
 *                          choices={getCitiesFor(formData.country)}
 *                      />
 *                 }
 *             </FormDataConsumer>
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export const FormDataConsumer = <
    TFieldValues extends FieldValues = FieldValues,
>(
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
    TFieldValues extends FieldValues = FieldValues,
>(
    props: Props<TFieldValues>
) => {
    const { children, formData, source } = props;
    const [result, setResult] = React.useState<ReactNode>(null);

    const finalSource = useWrappedSource(source || '');
    const render = useEvent(children);

    // Getting the result of the children function in a useEffect allows us to keep a stable reference to is
    // with useEvent
    React.useEffect(() => {
        // Passes an empty string here as we don't have the children sources and we just want to know if we are in an iterator
        const matches = ArraySourceRegex.exec(finalSource);
        // If we have an index, we are in an iterator like component (such as the SimpleFormIterator)
        if (matches) {
            const scopedFormData = get(formData, matches[0]);
            setResult(render({ formData, scopedFormData }));
        } else {
            setResult(render({ formData }));
        }
    }, [finalSource, formData, render]);

    return result;
};

const ArraySourceRegex = new RegExp(/.+\.\d+$/);

export interface FormDataConsumerRenderParams<
    TFieldValues extends FieldValues = FieldValues,
    TScopedFieldValues extends FieldValues = TFieldValues,
> {
    formData: TFieldValues;
    scopedFormData?: TScopedFieldValues;
}

export type FormDataConsumerRender<
    TFieldValues extends FieldValues = FieldValues,
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
