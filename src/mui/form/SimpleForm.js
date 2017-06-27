import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import getDefaultValues from './getDefaultValues';
import FormField from './FormField';
import Toolbar from './Toolbar';

export const SimpleForm = ({ children, handleSubmit, invalid, record, resource, basePath, submitOnEnter, save, toolbar, redirect }) => (
    <form className="simple-form">
        <div style={{ padding: '0 1em 1em 1em' }}>
            {Children.map(children, input => input && (
                <div key={input.props.source} className={`aor-input-${input.props.source}`} style={input.props.style}>
                    <FormField input={input} resource={resource} record={record} basePath={basePath} />
                </div>
            ))}
        </div>
        {toolbar && React.cloneElement(toolbar, {
            invalid,
            submitOnEnter,
            handleSubmitWithRedirect: redirectTo => handleSubmit(values => save(values, redirectTo)),
            redirect,
        })}
    </form>
);

SimpleForm.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    defaultValue: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    validate: PropTypes.func,
};

SimpleForm.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: getDefaultValues(state, props),
    })),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    }),
);

export default enhance(SimpleForm);
