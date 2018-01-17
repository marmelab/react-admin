import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

import getDefaultValues from './getDefaultValues';
import FormWrapper from './FormWrapper';
import SimpleFormLayoutFactory from './SimpleFormLayoutFactory';

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

export class SimpleForm extends Component {
    handleSubmitWithRedirect = (redirect = this.props.redirect) =>
        this.props.handleSubmit(values => this.props.save(values, redirect));

    render() {
        const {
            classes = {},
            className,
            toolbar,
            renderWrapper,
            renderLayout,
            ...rest
        } = this.props;

        return (
            <FormWrapper
                className={classnames('simple-form', className)}
                render={renderWrapper}
                {...rest}
            >
                <SimpleFormLayoutFactory
                    toolbar={toolbar}
                    render={renderLayout}
                    className={classes.form}
                    handleSubmitWithRedirect={this.handleSubmitWithRedirect}
                    {...rest}
                />
            </FormWrapper>
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
    record: PropTypes.object,
    resource: PropTypes.string,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    renderWrapper: PropTypes.func,
    renderLayout: PropTypes.func,
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    validate: PropTypes.func,
    version: PropTypes.number,
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: getDefaultValues(state, props),
    })),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    }),
    withStyles(styles)
);

export default enhance(SimpleForm);
