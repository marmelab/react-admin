import * as React from 'react';
import { ReactNode } from 'react';
import { useFormState } from 'react-final-form';
import { FormSubscription } from 'final-form';
import get from 'lodash/get';

import warning from '../util/warning';

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
    subscription?: FormSubscription;
    [key: string]: any;
}

interface Props extends ConnectedProps {
    formData: any;
    index?: number;
}

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
const FormDataConsumer = ({ subscription, ...props }: ConnectedProps) => {
    const formState = useFormState({ subscription });

    return <FormDataConsumerView formData={formState.values} {...props} />;
};

export const FormDataConsumerView = (props: Props) => {
    const { children, form, formData, source, index, ...rest } = props;
    let scopedFormData = formData;
    let getSource;
    let getSourceHasBeenCalled = false;
    let ret;

    // If we have an index, we are in an iterator like component (such as the SimpleFormIterator)
    if (typeof index !== 'undefined') {
        scopedFormData = get(formData, source);
        getSource = (scopedSource: string) => {
            getSourceHasBeenCalled = true;
            return `${source}.${scopedSource}`;
        };
        ret = children({ formData, scopedFormData, getSource, ...rest });
    } else {
        ret = children({ formData, ...rest });
    }

    warning(
        typeof index !== 'undefined' && ret && !getSourceHasBeenCalled,
        `You're using a FormDataConsumer inside an ArrayInput and you did not call the getSource function supplied by the FormDataConsumer component. This is required for your inputs to get the proper source.

<ArrayInput source="users">
    <SimpleFormIterator>
        <TextInput source="name" />

        <FormDataConsumer>
            {({
                formData, // The whole form data
                scopedFormData, // The data for this item of the ArrayInput
                getSource, // A function to get the valid source inside an ArrayInput
                ...rest,
            }) =>
                scopedFormData.name ? (
                    <SelectInput
                        source={getSource('role')} // Will translate to "users[0].role"
                        choices={[{id: 1, name: 'Admin'}, {id: 2, name: 'User'},
                        {...rest}
                    />
                ) : null
            }
        </FormDataConsumer>
    </SimpleFormIterator>
</ArrayInput>`
    );

    return ret === undefined ? null : ret;
};

export default FormDataConsumer;
