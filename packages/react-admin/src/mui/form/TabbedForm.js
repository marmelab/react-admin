import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    getFormAsyncErrors,
    getFormSubmitErrors,
    getFormSyncErrors,
    reduxForm,
} from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';

import TabbedFormLayoutFactory from './TabbedFormLayoutFactory';
import FormWrapper from './FormWrapper';
import getDefaultValues from './getDefaultValues';

const styles = theme => ({
    form: {
        [theme.breakpoints.up('sm')]: {
            padding: '0 1em 1em 1em',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '0 1em 5em 1em',
        },
    },
    errorTabButton: { color: theme.palette.error[500] },
});

export class TabbedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleSubmitWithRedirect = (redirect = this.props.redirect) =>
        this.props.handleSubmit(values => this.props.save(values, redirect));

    render() {
        const {
            className,
            renderLayout,
            tabsWithErrors,
            toolbar,
            ...rest
        } = this.props;

        return (
            <FormWrapper
                className={classnames('tabbed-form', className)}
                render={renderLayout}
                {...rest}
            >
                <TabbedFormLayoutFactory
                    value={this.state.value}
                    toolbar={toolbar}
                    tabsWithErrors={tabsWithErrors}
                    handleSubmitWithRedirect={this.handleSubmitWithRedirect}
                    handleChange={this.handleChange}
                    {...rest}
                />
            </FormWrapper>
        );
    }
}

TabbedForm.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    classes: PropTypes.object,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    record: PropTypes.object,
    renderLayout: PropTypes.func,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: PropTypes.bool,
    tabsWithErrors: PropTypes.arrayOf(PropTypes.string),
    toolbar: PropTypes.element,
    translate: PropTypes.func.isRequired,
    validate: PropTypes.func,
    version: PropTypes.number,
};

const collectErrors = state => {
    const syncErrors = getFormSyncErrors('record-form')(state);
    const asyncErrors = getFormAsyncErrors('record-form')(state);
    const submitErrors = getFormSubmitErrors('record-form')(state);

    return {
        ...syncErrors,
        ...asyncErrors,
        ...submitErrors,
    };
};

export const findTabsWithErrors = (
    state,
    props,
    collectErrorsImpl = collectErrors
) => {
    const errors = collectErrorsImpl(state);

    return Children.toArray(props.children).reduce((acc, child) => {
        const inputs = Children.toArray(child.props.children);

        if (inputs.some(input => errors[input.props.source])) {
            return [...acc, child.props.label];
        }

        return acc;
    }, []);
};

const enhance = compose(
    connect((state, props) => {
        const children = Children.toArray(props.children).reduce(
            (acc, child) => [...acc, ...Children.toArray(child.props.children)],
            []
        );

        return {
            tabsWithErrors: findTabsWithErrors(state, props),
            initialValues: getDefaultValues(state, { ...props, children }),
        };
    }),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    }),
    withStyles(styles)
);

export default enhance(TabbedForm);
