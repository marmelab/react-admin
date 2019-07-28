import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';

import FilterFormInput from './FilterFormInput';

const useStyles = makeStyles({
    form: {
        marginTop: '-10px',
        paddingTop: 0,
        display: 'flex',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    clearFix: { clear: 'right' },
});

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
    dispatch,
    displayedFilters,
    filterValues,
    handleSubmit,
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
    submitFailed,
    submitSucceeded,
    submitting,
    touch,
    triggerSubmit,
    untouch,
    valid,
    validate,
    _reduxForm,
    ...props
}) => props;

const FilterForm = ({
    className,
    resource,
    hideFilter,
    filters,
    displayedFilters,
    initialValues,
    ...rest
}) => {
    const classes = useStyles();

    useEffect(() => {
        filters.forEach(filter => {
            if (filter.props.alwaysOn && filter.props.defaultValue) {
                throw new Error(
                    'Cannot use alwaysOn and defaultValue on a filter input. Please set the filterDefaultValues props on the <List> element instead.'
                );
            }
        });
    }, [filters]);

    const getShownFilters = () => {
        return filters.filter(
            filterElement =>
                filterElement.props.alwaysOn ||
                displayedFilters[filterElement.props.source] ||
                typeof lodashGet(initialValues, filterElement.props.source) !==
                    'undefined'
        );
    };

    const handleHide = event => hideFilter(event.currentTarget.dataset.key);

    return (
        <div
            className={classnames(className, classes.form)}
            {...sanitizeRestProps(rest)}
        >
            {getShownFilters().map(filterElement => (
                <FilterFormInput
                    key={filterElement.props.source}
                    filterElement={filterElement}
                    handleHide={handleHide}
                    resource={resource}
                />
            ))}
            <div className={classes.clearFix} />
        </div>
    );
};

FilterForm.propTypes = {
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    hideFilter: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    className: PropTypes.string,
};

export const mergeInitialValuesWithDefaultValues = ({
    initialValues,
    filters,
}) => ({
    initialValues: {
        ...filters
            .filter(
                filterElement =>
                    filterElement.props.alwaysOn &&
                    filterElement.props.defaultValue
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
    },
});

const enhance = compose(
    withProps(mergeInitialValuesWithDefaultValues),
    reduxForm({
        form: 'filterForm',
        enableReinitialize: true,
        destroyOnUnmount: false, // do not destroy to preserve state across navigation
        onChange: (values, dispatch, props) =>
            props && props.setFilters(values),
    })
);

export default enhance(FilterForm);
