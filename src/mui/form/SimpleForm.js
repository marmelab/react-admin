import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import getDefaultValues from './getDefaultValues';
import FormInput from './FormInput';
import Toolbar from './Toolbar';

const formStyle = { padding: '0 1em 3em 1em' };

export class SimpleForm extends Component {
    handleSubmitWithRedirect = (redirect = this.props.redirect) =>
        // Ensure we don't pass our internal __aor_version__ used
        // for refresh in the values
        this.props.handleSubmit(({ __aor_version__, ...values }) =>
            this.props.save(values, redirect)
        );

    render() {
        const {
            basePath,
            children,
            invalid,
            record,
            resource,
            submitOnEnter,
            toolbar,
            version,
        } = this.props;

        return (
            <form className="simple-form">
                <div style={formStyle} key={version}>
                    {Children.map(children, input => (
                        <FormInput
                            basePath={basePath}
                            input={input}
                            record={record}
                            resource={resource}
                        />
                    ))}
                </div>
                {toolbar &&
                    React.cloneElement(toolbar, {
                        handleSubmitWithRedirect: this.handleSubmitWithRedirect,
                        invalid,
                        submitOnEnter,
                    })}
            </form>
        );
    }
}

SimpleForm.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    validate: PropTypes.func,
    version: PropTypes.number,
};

SimpleForm.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: {
            // Adds the version to force redux-form to reinitialize on refresh
            __aor_version__: props.version,
            ...getDefaultValues(state, props),
        },
    })),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    })
);

export default enhance(SimpleForm);
