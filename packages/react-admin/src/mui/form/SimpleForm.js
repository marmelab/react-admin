import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

import getDefaultValues from './getDefaultValues';
import FormInput from './FormInput';
import Toolbar from './Toolbar';
import promisingForm from './promisingForm';
import GenericFormError from './GenericFormError';

const styles = theme => ({
    form: {
        [theme.breakpoints.up('sm')]: {
            padding: '0 1em 1em 1em',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '0 1em 5em 1em',
        },
    },
});

const sanitizeRestProps = ({
    anyTouched,
    asyncValidate,
    asyncValidating,
    clearSubmit,
    dirty,
    handleSubmit,
    initialized,
    initialValues,
    pristine,
    submitting,
    submitFailed,
    submitSucceeded,
    valid,
    pure,
    triggerSubmit,
    clearSubmitErrors,
    clearAsyncError,
    blur,
    change,
    destroy,
    dispatch,
    initialize,
    reset,
    touch,
    untouch,
    validate,
    save,
    translate,
    autofill,
    submit,
    redirect,
    array,
    form,
    ...props
}) => props;

export class SimpleForm extends Component {
    handleSubmitWithRedirect = (redirect = this.props.redirect) =>
        this.props.handleSubmit((values, ...otherArgs) =>
            this.props.save(values, redirect, ...otherArgs)
        );

    render() {
        const {
            basePath,
            children,
            classes = {},
            className,
            invalid,
            pristine,
            record,
            resource,
            submitOnEnter,
            toolbar,
            version,
            translate,
            error,
            ...rest
        } = this.props;

        return (
            <form
                className={classnames('simple-form', className)}
                {...sanitizeRestProps(rest)}
            >
                <GenericFormError error={error && translate(error)} />
                <div className={classes.form} key={version}>
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
                        pristine,
                        submitOnEnter,
                    })}
            </form>
        );
    }
}

SimpleForm.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    error: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
        PropTypes.string,
    ]),
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: PropTypes.bool,
    translate: PropTypes.func.isRequired,
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
        initialValues: getDefaultValues(state, props),
    })),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    }),
    promisingForm,
    withStyles(styles)
);

export default enhance(SimpleForm);
