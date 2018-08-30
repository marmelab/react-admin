import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import get from 'lodash/get';

const REDUX_FORM_NAME = 'record-form';

const warnAboutArrayInput = () =>
    console.warn( // eslint-disable-line
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
const FormDataConsumer = ({ children, formData, source, index, ...rest }) => {
    let scopedFormData = formData;
    let getSource;
    let getSourceHasBeenCalled = false;
    let ret;

    // If we have an index, we are in an iterator like component (such as the SimpleFormIterator)
    if (typeof index !== 'undefined') {
        scopedFormData = get(formData, source);
        getSource = scopedSource => {
            getSourceHasBeenCalled = true;
            return `${source}.${scopedSource}`;
        };
        ret = children({ formData, scopedFormData, getSource, ...rest });
    } else {
        ret = children({ formData, ...rest });
    }

    if (
        typeof index !== 'undefined' &&
        ret &&
        !getSourceHasBeenCalled &&
        process.env.NODE_ENV !== 'production'
    ) {
        warnAboutArrayInput();
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
