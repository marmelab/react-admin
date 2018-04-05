import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import { getDefaultValues, translate } from 'ra-core';
import FormInput from './FormInput';
import Toolbar from './Toolbar';

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
    array,
    asyncValidate,
    asyncValidating,
    autofill,
    blur,
    change,
    clearAsyncError,
    clearFields,
    clearSubmit,
    clearSubmitErrors,
    destroy,
    dirty,
    dispatch,
    form,
    handleSubmit,
    initialize,
    initialized,
    initialValues,
    pristine,
    pure,
    redirect,
    reset,
    resetSection,
    save,
    submit,
    submitFailed,
    submitSucceeded,
    submitting,
    touch,
    translate,
    triggerSubmit,
    untouch,
    valid,
    validate,
    ...props
}) => props;

export class SimpleForm extends Component {
    handleSubmitWithRedirect = (redirect = this.props.redirect) =>
        this.props.handleSubmit(values => this.props.save(values, redirect));

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
            ...rest
        } = this.props;

        return (
            <form
                className={classnames('simple-form', className)}
                {...sanitizeRestProps(rest)}
            >
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
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
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
        initialValues: getDefaultValues(state, props),
    })),
    translate, // Must be before reduxForm so that it can be used in validation
    reduxForm({
        form: 'record-form',
        destroyOnUnmount: false,
        enableReinitialize: true,
    }),
    withStyles(styles)
);

export default enhance(SimpleForm);
