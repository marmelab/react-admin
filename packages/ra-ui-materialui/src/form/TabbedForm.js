import React, { Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    reduxForm,
    getFormAsyncErrors,
    getFormSyncErrors,
    getFormSubmitErrors,
} from 'redux-form';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import compose from 'recompose/compose';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { getDefaultValues, translate, REDUX_FORM_NAME } from 'ra-core';

import Toolbar from './Toolbar';
import CardContentInner from '../layout/CardContentInner';
import TabbedFormTabs from './TabbedFormTabs';

const useStyles = makeStyles(theme => ({
    errorTabButton: { color: theme.palette.error.main },
}));

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
    staticContext,
    submit,
    submitAsSideEffect,
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
    _reduxForm,
    ...props
}) => props;

export const getTabFullPath = (tab, index, baseUrl) =>
    `${baseUrl}${
        tab.props.path ? `/${tab.props.path}` : index > 0 ? `/${index}` : ''
    }`;

const TabbedForm = ({
    basePath,
    children,
    className,
    invalid,
    location,
    match,
    pristine,
    record,
    redirect,
    resource,
    saving,
    submitOnEnter,
    tabs,
    tabsWithErrors,
    toolbar,
    translate,
    undoable,
    value,
    version,
    save,
    handleSubmit,
    ...rest
}) => {
    const classes = useStyles();
    const handleSubmitWithRedirect = (redirect = redirect) =>
        handleSubmit(values => save(values, redirect));

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
                    currentLocationPath: location.pathname,
                    url,
                    tabsWithErrors,
                },
                children
            )}
            <Divider />
            <CardContentInner>
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
                                              /**
                                               * Force redraw when the tab becomes active
                                               *
                                               * This is because the fields, decorated by redux-form and connect,
                                               * aren't redrawn by default when the tab becomes active.
                                               * Unfortunately, some material-ui fields (like multiline TextField)
                                               * compute their size based on the scrollHeight of a dummy DOM element,
                                               * and scrollHeight is 0 in a hidden div. So they must be redrawn
                                               * once the tab becomes active.
                                               *
                                               * @ref https://github.com/marmelab/react-admin/issues/1956
                                               */
                                              key: `${index}_${!routeProps.match}`,
                                          })
                                        : null
                                }
                            </Route>
                        )
                )}
            </CardContentInner>
            {toolbar &&
                React.cloneElement(toolbar, {
                    basePath,
                    className: 'toolbar',
                    handleSubmitWithRedirect,
                    handleSubmit,
                    invalid,
                    pristine,
                    record,
                    redirect,
                    resource,
                    saving,
                    submitOnEnter,
                    undoable,
                })}
        </form>
    );
};

TabbedForm.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    handleSubmit: PropTypes.func, // passed by redux-form
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

TabbedForm.defaultProps = {
    submitOnEnter: true,
    tabs: <TabbedFormTabs />,
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
        if (!isValidElement(child)) {
            return acc;
        }

        const inputs = Children.toArray(child.props.children);

        if (
            inputs.some(
                input => isValidElement(input) && errors[input.props.source]
            )
        ) {
            return [...acc, child.props.label];
        }

        return acc;
    }, []);
};

const enhance = compose(
    withRouter,
    connect((state, props) => {
        const children = Children.toArray(props.children).reduce(
            (acc, child) => [
                ...acc,
                ...(isValidElement(child)
                    ? Children.toArray(child.props.children)
                    : []),
            ],
            []
        );

        return {
            form: props.form || REDUX_FORM_NAME,
            initialValues: getDefaultValues(state, { ...props, children }),
            saving: props.saving || state.admin.saving,
            tabsWithErrors: findTabsWithErrors(state, {
                form: REDUX_FORM_NAME,
                ...props,
            }),
        };
    }),
    translate, // Must be before reduxForm so that it can be used in validation
    reduxForm({
        destroyOnUnmount: false,
        enableReinitialize: true,
        keepDirtyOnReinitialize: true,
    })
);

export default enhance(TabbedForm);
