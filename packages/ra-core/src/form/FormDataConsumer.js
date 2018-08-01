import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

const REDUX_FORM_NAME = 'record-form';
const ARRAY_SOURCE_REGEX = /^(.*)\[(\d*)\]/;

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
const FormDataConsumer = ({ children, formData, source, ...rest }) => {
    let scopedFormData = formData;
    let getSource;
    let getSourceHasBeenCalled = false;

    // If we have a source, we are in an ArrayInput component
    if (source) {
        const matches = ARRAY_SOURCE_REGEX.exec(source);

        if (matches.length > 2) {
            const [, arraySource, index] = matches;
            scopedFormData = formData[arraySource][parseInt(index)];
            getSource = scopedSource => {
                getSourceHasBeenCalled = true;
                return `${arraySource}[${index}].${scopedSource}`;
            };
        }
    }
    const ret = children({ formData, scopedFormData, getSource, ...rest });

    if (
        ret &&
        !getSourceHasBeenCalled &&
        process.env.NODE_ENV !== 'production'
    ) {
        console.warn( // eslint-disable-line
            `You have an input inside a FormDataConsumer inside an ArrayInput and you did not called the getSource function supplied by the FormDataConsumer component. This is required for your input to get the proper source and name.

            <ArrayInput source="users">
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
            </ArrayInput>
            `
        );
    }

    return ret === undefined ? null : ret;
};

FormDataConsumer.propTypes = {
    children: PropTypes.func.isRequired,
    data: PropTypes.object,
};

const mapStateToProps = (state, { record }) => ({
    formData: getFormValues(REDUX_FORM_NAME)(state) || record,
});

export default connect(mapStateToProps)(FormDataConsumer);
