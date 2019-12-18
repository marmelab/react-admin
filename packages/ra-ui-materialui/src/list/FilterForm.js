import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';

import FilterFormInput from './FilterFormInput';

const useStyles = makeStyles(
    theme => ({
        form: {
            marginTop: -theme.spacing(2),
            paddingTop: 0,
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            minHeight: theme.spacing(9.5),
        },
        clearFix: { clear: 'right' },
    }),
    { name: 'RaFilterForm' }
);

const sanitizeRestProps = ({
    anyTouched,
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
    displayedFilters,
    errors,
    filters,
    filterValues,
    form,
    handleSubmit,
    hasSubmitErrors,
    hasValidationErrors,
    hideFilter,
    initialize,
    initialized,
    initialValues,
    invalid,
    modified,
    pristine,
    pure,
    reset,
    resetSection,
    save,
    setFilter,
    setFilters,
    submit,
    submitAsSideEffect,
    submitError,
    submitErrors,
    submitFailed,
    submitSucceeded,
    submitting,
    touch,
    touched,
    triggerSubmit,
    untouch,
    valid,
    validate,
    validating,
    values,
    visited,
    __versions,
    ...props
}) => props;

export const FilterForm = ({
    classes = {},
    className,
    resource,
    margin,
    variant,
    filters,
    displayedFilters,
    hideFilter,
    initialValues,
    ...rest
}) => {
    useEffect(() => {
        filters.forEach(filter => {
            if (filter.props.alwaysOn && filter.props.defaultValue) {
                throw new Error(
                    'Cannot use alwaysOn and defaultValue on a filter input. Please set the filterDefaultValues props on the <List> element instead.'
                );
            }
        });
    }, [filters]);

    const getShownFilters = () =>
        filters.filter(
            filterElement =>
                filterElement.props.alwaysOn ||
                displayedFilters[filterElement.props.source] ||
                typeof lodashGet(initialValues, filterElement.props.source) !==
                    'undefined'
        );

    const handleHide = useCallback(
        event => hideFilter(event.currentTarget.dataset.key),
        [hideFilter]
    );

    return (
        <form
            className={classnames(className, classes.form)}
            {...sanitizeRestProps(rest)}
            onSubmit={handleSubmit}
        >
            {getShownFilters().map(filterElement => (
                <FilterFormInput
                    key={filterElement.props.source}
                    filterElement={filterElement}
                    handleHide={handleHide}
                    resource={resource}
                    margin={margin}
                    variant={variant}
                />
            ))}
            <div className={classes.clearFix} />
        </form>
    );
};

const handleSubmit = event => {
    event.preventDefault();
    return false;
};

FilterForm.propTypes = {
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    hideFilter: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    classes: PropTypes.object,
    className: PropTypes.string,
};

export const mergeInitialValuesWithDefaultValues = ({
    initialValues,
    filters,
}) => ({
    ...filters
        .filter(
            filterElement =>
                filterElement.props.alwaysOn && filterElement.props.defaultValue
        )
        .reduce(
            (acc, filterElement) =>
                lodashSet(
                    { ...acc },
                    filterElement.props.source,
                    filterElement.props.defaultValue
                ),
            {}
        ),
    ...initialValues,
});

const EnhancedFilterForm = ({ classes: classesOverride, ...props }) => {
    const classes = useStyles({ classes: classesOverride });

    const mergedInitialValuesWithDefaultValues = mergeInitialValuesWithDefaultValues(
        props
    );

    const { initialValues, ...rest } = props;

    return (
        <Form
            onSubmit={handleFinalFormSubmit}
            initialValues={mergedInitialValuesWithDefaultValues}
            mutators={{ ...arrayMutators }}
            render={formProps => (
                <>
                    <FormSpy
                        subscription={FormSpySubscription}
                        onChange={({ pristine, values }) => {
                            if (pristine) {
                                return;
                            }
                            props && props.setFilters(values);
                        }}
                    />
                    <FilterForm classes={classes} {...formProps} {...rest} />
                </>
            )}
        />
    );
};

const handleFinalFormSubmit = () => {};

// Options to instruct the FormSpy that it should only listen to the values and pristine changes
const FormSpySubscription = { values: true, pristine: true };

export default EnhancedFilterForm;
