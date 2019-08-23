import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormSpy } from 'react-final-form';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';

import FilterFormInput from './FilterFormInput';

const useStyles = makeStyles(theme => ({
    form: {
        marginTop: -theme.spacing(2),
        paddingTop: 0,
        display: 'flex',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    clearFix: { clear: 'right' },
}));

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
    dirtySinceLastSubmit,
    dispatch,
    displayedFilters,
    filterValues,
    handleSubmit,
    hasSubmitErrors,
    hasValidationErrors,
    hideFilter,
    initialize,
    initialized,
    initialValues,
    invalid,
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
    triggerSubmit,
    untouch,
    valid,
    validate,
    validating,
    _reduxForm,
    ...props
}) => props;

export class FilterForm extends Component {
    componentDidMount() {
        this.props.filters.forEach(filter => {
            if (filter.props.alwaysOn && filter.props.defaultValue) {
                throw new Error(
                    'Cannot use alwaysOn and defaultValue on a filter input. Please set the filterDefaultValues props on the <List> element instead.'
                );
            }
        });
    }

    getShownFilters() {
        const { filters, displayedFilters, initialValues } = this.props;

        return filters.filter(
            filterElement =>
                filterElement.props.alwaysOn ||
                displayedFilters[filterElement.props.source] ||
                typeof lodashGet(initialValues, filterElement.props.source) !==
                    'undefined'
        );
    }

    handleHide = event =>
        this.props.hideFilter(event.currentTarget.dataset.key);

    render() {
        const {
            classes = {},
            className,
            resource,
            margin,
            variant,
            ...rest
        } = this.props;

        return (
            <form
                className={classnames(className, classes.form)}
                {...sanitizeRestProps(rest)}
            >
                {this.getShownFilters().map(filterElement => (
                    <FilterFormInput
                        key={filterElement.props.source}
                        filterElement={filterElement}
                        handleHide={this.handleHide}
                        resource={resource}
                        margin={margin}
                        variant={variant}
                    />
                ))}
                <div className={classes.clearFix} />
            </form>
        );
    }
}

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

const EnhancedFilterForm = props => {
    const classes = useStyles();

    const mergedInitialValuesWithDefaultValues = mergeInitialValuesWithDefaultValues(
        props
    );

    const { initialValues, ...rest } = props;

    return (
        <Form
            onSubmit={() => {}}
            initialValues={mergedInitialValuesWithDefaultValues}
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

// Options to instruct the FormSpy that it should only listen to the values and pristine changes
const FormSpySubscription = { values: true, pristine: true };

export default EnhancedFilterForm;
