import React, { ReactNode, SFC } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues, FormName } from 'redux-form';
import get from 'lodash/get';

import warning from '../util/warning';
import { ReduxState } from '../types';

interface ChildrenFunctionParams {
    formData: any;
    scopedFormData?: any;
    getSource?: (source: string) => string;
}

interface ConnectedProps {
    children: (params: ChildrenFunctionParams) => ReactNode;
    form?: string;
    record?: any;
    source?: string;
    [key: string]: any;
}

interface Props extends ConnectedProps {
    formData: any;
    index?: number;
}

/**
 * Get the current (edited) value of the record from the form and pass it
 * to child function
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
export const FormDataConsumerView: SFC<Props> = ({
    children,
    form,
    formData,
    source,
    index,
    ...rest
}) => {
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
        `You're using a FormDataConsumer inside an ArrayInput and you did not called the getSource function supplied by the FormDataConsumer component. This is required for your inputs to get the proper source.

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
                        choices={['admin', 'user']}
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

const mapStateToProps = (
    state: ReduxState,
    { form, record }: ConnectedProps
) => ({
    formData: getFormValues(form)(state) || record,
});

const ConnectedFormDataConsumerView = connect(mapStateToProps)(
    FormDataConsumerView
);

const FormDataConsumer = (props: ConnectedProps) => (
    <FormName>
        {({ form }) => <ConnectedFormDataConsumerView form={form} {...props} />}
    </FormName>
);

export default FormDataConsumer;
