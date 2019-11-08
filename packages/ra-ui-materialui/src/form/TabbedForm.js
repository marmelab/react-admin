import React, { Children, useCallback, isValidElement, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Route } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {
    useTranslate,
    useInitializeFormWithRecord,
    sanitizeEmptyValues,
} from 'ra-core';
import get from 'lodash/get';

import getFormInitialValues from './getFormInitialValues';
import Toolbar from './Toolbar';
import TabbedFormTabs, { getTabFullPath } from './TabbedFormTabs';
import { useRouteMatch, useLocation } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    errorTabButton: { color: theme.palette.error.main },
    content: {
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

const TabbedForm = ({ initialValues, defaultValue, saving, ...props }) => {
    let redirect = useRef(props.redirect);
    // We don't use state here for two reasons:
    // 1. There no way to execute code only after the state has been updated
    // 2. We don't want the form to rerender when redirect is changed
    const setRedirect = newRedirect => {
        redirect.current = newRedirect;
    };

    const translate = useTranslate();
    const classes = useStyles();

    const finalInitialValues = getFormInitialValues(
        initialValues,
        defaultValue,
        props.record
    );

    const submit = values => {
        const finalRedirect =
            typeof redirect.current === undefined
                ? props.redirect
                : redirect.current;
        const finalValues = sanitizeEmptyValues(finalInitialValues, values);

        props.save(finalValues, finalRedirect);
    };

    return (
        <Form
            key={props.version}
            initialValues={finalInitialValues}
            onSubmit={submit}
            mutators={{ ...arrayMutators }}
            setRedirect={setRedirect}
            keepDirtyOnReinitialize
            subscription={defaultSubscription}
            {...props}
            render={formProps => (
                <TabbedFormView
                    classes={classes}
                    saving={formProps.submitting || saving}
                    translate={translate}
                    {...props}
                    {...formProps}
                />
            )}
        />
    );
};

const defaultSubscription = {
    submitting: true,
    pristine: true,
    valid: true,
    invalid: true,
};

export default TabbedForm;

export const TabbedFormView = ({
    basePath,
    children,
    className,
    classes = {},
    form,
    handleSubmit,
    invalid,
    pristine,
    record,
    redirect: defaultRedirect,
    resource,
    saving,
    setRedirect,
    submitOnEnter,
    tabs,
    toolbar,
    translate,
    undoable,
    value,
    version,
    variant,
    margin,
    ...rest
}) => {
    useInitializeFormWithRecord(record);

    const handleSubmitWithRedirect = useCallback(
        (redirect = defaultRedirect) => {
            setRedirect(redirect);
            handleSubmit();
        },
        [setRedirect, defaultRedirect, handleSubmit]
    );

    const tabsWithErrors = findTabsWithErrors(children, form.getState().errors);

    const match = useRouteMatch();
    const location = useLocation();

    const url = match ? match.url : location.pathname;
    return (
        <form
            className={classnames('tabbed-form', className)}
            key={version}
            {...sanitizeRestProps(rest)}
        >
            {React.cloneElement(
                tabs,
                {
                    classes,
                    url,
                    tabsWithErrors,
                },
                children
            )}
            <Divider />
            <div className={classes.content}>
                {/* All tabs are rendered (not only the one in focus), to allow validation
                on tabs not in focus. The tabs receive a `hidden` property, which they'll
                use to hide the tab using CSS if it's not the one in focus.
                See https://github.com/marmelab/react-admin/issues/1866 */}
                {Children.map(
                    children,
                    (tab, index) =>
                        tab && (
                            <Route exact path={getTabFullPath(tab, index, url)}>
                                {routeProps =>
                                    isValidElement(tab)
                                        ? React.cloneElement(tab, {
                                              intent: 'content',
                                              resource,
                                              record,
                                              basePath,
                                              hidden: !routeProps.match,
                                              variant,
                                              margin,
                                          })
                                        : null
                                }
                            </Route>
                        )
                )}
            </div>
            {toolbar &&
                React.cloneElement(toolbar, {
                    basePath,
                    className: 'toolbar',
                    handleSubmitWithRedirect,
                    handleSubmit,
                    invalid,
                    pristine,
                    record,
                    redirect: defaultRedirect,
                    resource,
                    saving,
                    submitOnEnter,
                    undoable,
                })}
        </form>
    );
};

TabbedFormView.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    classes: PropTypes.object,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // @deprecated
    initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    handleSubmit: PropTypes.func, // passed by react-final-form
    invalid: PropTypes.bool,
    location: PropTypes.object,
    match: PropTypes.object,
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
    tabs: PropTypes.element.isRequired,
    tabsWithErrors: PropTypes.arrayOf(PropTypes.string),
    toolbar: PropTypes.element,
    translate: PropTypes.func,
    undoable: PropTypes.bool,
    validate: PropTypes.func,
    value: PropTypes.number,
    version: PropTypes.number,
};

TabbedFormView.defaultProps = {
    submitOnEnter: true,
    tabs: <TabbedFormTabs />,
    toolbar: <Toolbar />,
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
    clearAsyncError,
    clearFields,
    clearSubmit,
    clearSubmitErrors,
    destroy,
    dirty,
    dirtyFields,
    dirtyFieldsSinceLastSubmit,
    dirtySinceLastSubmit,
    dispatch,
    form,
    handleSubmit,
    hasSubmitErrors,
    hasValidationErrors,
    initialize,
    initialized,
    initialValues,
    pristine,
    pure,
    redirect,
    reset,
    resetSection,
    save,
    staticContext,
    submit,
    submitAsSideEffect,
    submitError,
    submitErrors,
    submitFailed,
    submitSucceeded,
    submitting,
    touch,
    translate,
    triggerSubmit,
    undoable,
    untouch,
    valid,
    validate,
    validating,
    _reduxForm,
    ...props
}) => props;

export const findTabsWithErrors = (children, errors) => {
    return Children.toArray(children).reduce((acc, child) => {
        if (!isValidElement(child)) {
            return acc;
        }

        const inputs = Children.toArray(child.props.children);

        if (
            inputs.some(
                input =>
                    isValidElement(input) && get(errors, input.props.source)
            )
        ) {
            return [...acc, child.props.label];
        }

        return acc;
    }, []);
};
