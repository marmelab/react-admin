import React, { Children, Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { getFieldConstraints } from '../../util/validate';
import { SaveButton } from '../button';
import getDefaultValues from '../form/getDefaultValues';

/**
 * Validator function for redux-form
 */
export const validateForm = (values, { children, validation }) => {
    const errors = typeof validation === 'function' ? validation(values) : {};

    // warn user we expect an object here, in case of validation just returned an error message
    if (errors === null || typeof errors !== 'object') {
        throw new Error('Validation function given to form components should return an object.');
    }

    // digging first in `<FormTab>`, then in all children
    const fieldConstraints = Children.toArray(children)
        .map(child => child.props.children)
        .map(getFieldConstraints)
        .reduce((prev, next) => ({ ...prev, ...next }), {});
    Object.keys(fieldConstraints).forEach(fieldName => {
        const error = fieldConstraints[fieldName](values[fieldName], values);
        if (error.length > 0) {
            if (!errors[fieldName]) {
                errors[fieldName] = [];
            }
            errors[fieldName] = [...errors[fieldName], ...error];
        }
    });
    return errors;
};

export class TabbedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }

    handleChange = (value) => {
        this.setState({ value });
    };

    render() {
        const { children, contentContainerStyle, handleSubmit, invalid, record, resource, basePath } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <div style={{ padding: '0 1em 1em 1em' }}>
                    <Tabs value={this.state.value} onChange={this.handleChange} contentContainerStyle={contentContainerStyle}>
                        {React.Children.map(children, (tab, index) =>
                            <Tab key={tab.props.value} label={tab.props.label} value={index} icon={tab.props.icon}>
                                {React.cloneElement(tab, { resource, record, basePath })}
                            </Tab>
                        )}
                    </Tabs>
                </div>
                <Toolbar>
                    <ToolbarGroup>
                        <SaveButton invalid={invalid} />
                    </ToolbarGroup>
                </Toolbar>
            </form>
        );
    }
}

TabbedForm.propTypes = {
    children: PropTypes.node,
    contentContainerStyle: PropTypes.object,
    defaultValue: PropTypes.object,
    handleSubmit: PropTypes.func,
    invalid: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    validation: PropTypes.func,
};
TabbedForm.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
};

const ReduxForm = reduxForm({
    form: 'record-form',
    validate: validateForm,
})(TabbedForm);

const mapStateToProps = (state, props) => ({
    initialValues: getDefaultValues(Children.toArray(props.children))(props.record, props.defaultValue),
});

export default connect(mapStateToProps)(ReduxForm);
