import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

const REDUX_FORM_NAME = 'record-form';

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
 *                 {(formData, ...rest) => formData.hasEmail &&
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
 *                 {(formData, ...rest) =>
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
const FormDataConsumer = ({ children, formData, ...rest }) => {
    const ret = children(formData, ...rest);
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
