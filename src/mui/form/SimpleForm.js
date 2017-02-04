import React, { Children, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { validateForm } from '../../util/validate';
import { SaveButton } from '../button';
import getDefaultValues from '../form/getDefaultValues';
import FormField from './FormField';

export const SimpleForm = ({ children, handleSubmit, invalid, record, resource, basePath }) => (
    <form onSubmit={handleSubmit}>
        <div style={{ padding: '0 1em 1em 1em' }}>
            {React.Children.map(children, input => (
                <div key={input.props.source} style={input.props.style}>
                    <FormField input={input} resource={resource} record={record} basePath={basePath} />
                </div>
            ))}
        </div>
        <Toolbar>
            <ToolbarGroup>
                <SaveButton invalid={invalid} />
            </ToolbarGroup>
        </Toolbar>
    </form>
);

SimpleForm.propTypes = {
    children: PropTypes.node,
    defaultValue: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    handleSubmit: PropTypes.func,
    invalid: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    validation: PropTypes.func,
};

const ReduxForm = reduxForm({
    form: 'record-form',
    validate: validateForm,
})(SimpleForm);

const mapStateToProps = (state, props) => ({
    initialValues: getDefaultValues(state, props),
});

export default connect(mapStateToProps)(ReduxForm);
