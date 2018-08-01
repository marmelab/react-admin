import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { getDefaultValues, translate, REDUX_FORM_NAME } from 'ra-core';
import FormInput from './FormInput';
import Toolbar from './Toolbar';

const styles = {
    content: { paddingTop: 0 },
};

const sanitizeRestProps = ({
    anyTouched,
    array,
    asyncBlurFields,
    asyncValidate,
    asyncValidating,
    autofill,
    blur,
    change,
    classes,
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
            classes,
            className,
            invalid,
            pristine,
            record,
            redirect,
            resource,
            saving,
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
                <CardContent className={classes.content} key={version}>
                    {Children.map(children, input => (
                        <FormInput
                            basePath={basePath}
                            input={input}
                            record={record}
                            resource={resource}
                        />
                    ))}
                </CardContent>
                {toolbar &&
                    React.cloneElement(toolbar, {
                        basePath,
                        handleSubmitWithRedirect: this.handleSubmitWithRedirect,
                        handleSubmit: this.props.handleSubmit,
                        invalid,
                        pristine,
                        redirect,
                        saving,
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
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        form: props.form || REDUX_FORM_NAME,
        initialValues: getDefaultValues(state, props),
        saving: props.saving || state.admin.saving,
    })),
    translate, // Must be before reduxForm so that it can be used in validation
    reduxForm({
        enableReinitialize: true,
        keepDirtyOnReinitialize: true,
    }),
    withStyles(styles)
);

export default enhance(SimpleForm);
