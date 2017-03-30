import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import getDefaultValues from './getDefaultValues';
import FormField from './FormField';
import Toolbar from './Toolbar';

export const SimpleForm = ({ children, handleSubmit, invalid, record, resource, basePath, submitOnEnter }) => {
    const formOnSubmit = submitOnEnter ? handleSubmit : function noop() {};
    const toolbarProps = submitOnEnter ? {} : { submitOnEnter: submitOnEnter, handleSubmit: handleSubmit };
    return (
        <form onSubmit={formOnSubmit} className="simple-form">
            <div style={{ padding: '0 1em 1em 1em' }}>
                {React.Children.map(children, input => input && (
                    <div key={input.props.source} className={`aor-input-${input.props.source}`} style={input.props.style}>
                        <FormField input={input} resource={resource} record={record} basePath={basePath} />
                    </div>
                ))}
            </div>
            <Toolbar invalid={invalid} {...toolbarProps} />
        </form>
    );
};

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
    validate: PropTypes.func,
    submitOnEnter: PropTypes.bool,
};

SimpleForm.defaultProps = {
    submitOnEnter: true,
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
