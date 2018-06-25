import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    reduxForm,
    getFormAsyncErrors,
    getFormSyncErrors,
    getFormSubmitErrors,
} from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import { getDefaultValues, translate } from 'ra-core';

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
    errorTabButton: { color: theme.palette.error.main },
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
            basePath,
            children,
            className,
            classes = {},
            invalid,
            pristine,
            record,
            redirect,
            resource,
            saving,
            submitOnEnter,
            tabsWithErrors,
            toolbar,
            translate,
            version,
            ...rest
        } = this.props;

        return (
            <form
                className={classnames('tabbed-form', className)}
                key={version}
                {...sanitizeRestProps(rest)}
            >
                <Tabs
                    scrollable
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                >
                    {Children.map(
                        children,
                        (tab, index) =>
                            tab ? (
                                <Tab
                                    key={tab.props.label}
                                    label={translate(tab.props.label, {
                                        _: tab.props.label,
                                    })}
                                    value={index}
                                    icon={tab.props.icon}
                                    className={classnames(
                                        'form-tab',
                                        tabsWithErrors.includes(
                                            tab.props.label
                                        ) && this.state.value !== index
                                            ? classes.errorTabButton
                                            : null
                                    )}
                                />
                            ) : null
                    )}
                </Tabs>
                <Divider />
                <div className={classes.form}>
                    {Children.map(
                        children,
                        (tab, index) =>
                            tab &&
                            this.state.value === index &&
                            React.cloneElement(tab, {
                                resource,
                                record,
                                basePath,
                            })
                    )}
                    {toolbar &&
                        React.cloneElement(toolbar, {
                            className: 'toolbar',
                            handleSubmitWithRedirect: this
                                .handleSubmitWithRedirect,
                            invalid,
                            pristine,
                            redirect,
                            saving,
                            submitOnEnter,
                        })}
                </div>
            </form>
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
    pristine: PropTypes.bool,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    submitOnEnter: PropTypes.bool,
    tabsWithErrors: PropTypes.arrayOf(PropTypes.string),
    toolbar: PropTypes.element,
    translate: PropTypes.func,
    validate: PropTypes.func,
    version: PropTypes.number,
};

TabbedForm.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const collectErrors = (state, props) => {
    const syncErrors = getFormSyncErrors(props.form)(state);
    const asyncErrors = getFormAsyncErrors(props.form)(state);
    const submitErrors = getFormSubmitErrors(props.form)(state);

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
    const errors = collectErrorsImpl(state, props);

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
            initialValues: getDefaultValues(state, { ...props, children }),
            saving: props.saving || state.admin.saving,
            tabsWithErrors: findTabsWithErrors(state, props),
        };
    }),
    translate, // Must be before reduxForm so that it can be used in validation
    reduxForm({
        destroyOnUnmount: false,
        enableReinitialize: true,
    }),
    withStyles(styles)
);

export default enhance(TabbedForm);
