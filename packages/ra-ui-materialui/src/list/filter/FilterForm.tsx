import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    useEffect,
    useCallback,
    useContext,
    HtmlHTMLAttributes,
    ReactNode,
} from 'react';
import PropTypes from 'prop-types';
import { useListContext, useResourceContext } from 'ra-core';
import { Form, FormRenderProps, FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classnames from 'classnames';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';

import { FilterFormInput } from './FilterFormInput';
import { FilterContext } from '../FilterContext';

export const FilterFormBase = (props: FilterFormProps) => {
    const {
        className,
        margin,
        filters,
        variant,
        initialValues,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    const { displayedFilters = {}, hideFilter } = useListContext(props);
    useEffect(() => {
        filters.forEach((filter: JSX.Element) => {
            if (filter.props.alwaysOn && filter.props.defaultValue) {
                throw new Error(
                    'Cannot use alwaysOn and defaultValue on a filter input. Please set the filterDefaultValues props on the <List> element instead.'
                );
            }
        });
    }, [filters]);

    const getShownFilters = () =>
        filters.filter(
            (filterElement: JSX.Element) =>
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
        <StyledForm
            className={classnames(className, FilterFormClasses.form)}
            {...sanitizeRestProps(rest)}
            onSubmit={handleSubmit}
        >
            {getShownFilters().map((filterElement: JSX.Element) => (
                <FilterFormInput
                    key={filterElement.props.source}
                    filterElement={filterElement}
                    handleHide={handleHide}
                    resource={resource}
                    variant={filterElement.props.variant || variant}
                    margin={filterElement.props.margin || margin}
                />
            ))}
            <div className={FilterFormClasses.clearFix} />
        </StyledForm>
    );
};

const handleSubmit = event => {
    event.preventDefault();
    return false;
};

FilterFormBase.propTypes = {
    resource: PropTypes.string,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object,
    hideFilter: PropTypes.func,
    initialValues: PropTypes.object,
    className: PropTypes.string,
};

const sanitizeRestProps = ({
    active,
    dirty,
    dirtyFields,
    dirtyFieldsSinceLastSubmit,
    dirtySinceLastSubmit,
    displayedFilters,
    error,
    errors,
    filterValues,
    form,
    handleSubmit,
    hasSubmitErrors,
    hasValidationErrors,
    hideFilter,
    invalid,
    modified,
    modifiedSinceLastSubmit,
    pristine,
    resource,
    setFilters,
    submitError,
    submitErrors,
    submitFailed,
    submitSucceeded,
    submitting,
    touched,
    valid,
    validating,
    values,
    visited,
    ...props
}: Partial<FilterFormProps>) => props;

export interface FilterFormProps
    extends Omit<FormRenderProps, 'initialValues'>,
        Omit<HtmlHTMLAttributes<HTMLFormElement>, 'children'> {
    className?: string;
    resource?: string;
    filterValues: any;
    hideFilter: (filterName: string) => void;
    setFilters: (filters: any, displayedFilters: any) => void;
    displayedFilters: any;
    filters: ReactNode[];
    initialValues?: any;
    margin?: 'none' | 'normal' | 'dense';
    variant?: 'standard' | 'outlined' | 'filled';
}

export const mergeInitialValuesWithDefaultValues = (
    initialValues,
    filters
) => ({
    ...filters
        .filter(
            (filterElement: JSX.Element) =>
                filterElement.props.alwaysOn && filterElement.props.defaultValue
        )
        .reduce(
            (acc, filterElement: JSX.Element) =>
                lodashSet(
                    { ...acc },
                    filterElement.props.source,
                    filterElement.props.defaultValue
                ),
            {} as any
        ),
    ...initialValues,
});

export const FilterForm = props => {
    const {
        classes: classesOverride,
        filters: filtersProps,
        initialValues,
        ...rest
    } = props;

    const { setFilters, displayedFilters, filterValues } = useListContext(
        props
    );
    const filters = useContext(FilterContext) || filtersProps;

    const mergedInitialValuesWithDefaultValues = mergeInitialValuesWithDefaultValues(
        initialValues || filterValues,
        filters
    );

    return (
        <Form
            onSubmit={handleFinalFormSubmit}
            initialValues={mergedInitialValuesWithDefaultValues}
            mutators={{ ...arrayMutators }}
            render={formProps => (
                <>
                    <FormSpy
                        subscription={FormSpySubscription}
                        onChange={({ pristine, values, invalid }) => {
                            if (pristine || invalid) {
                                return;
                            }
                            setFilters(values, displayedFilters);
                        }}
                    />
                    <FilterFormBase
                        {...formProps}
                        {...rest}
                        filters={filters}
                    />
                </>
            )}
        />
    );
};

const handleFinalFormSubmit = () => {};

// Options to instruct the FormSpy that it should only listen to the values and pristine changes
const FormSpySubscription = { values: true, pristine: true, invalid: true };

const PREFIX = 'RaFilterForm';

export const FilterFormClasses = {
    form: `${PREFIX}-form`,
    clearFix: `${PREFIX}-clearFix`,
};

const StyledForm = styled('form', { name: PREFIX })(({ theme }) => ({
    [`&.${FilterFormClasses.form}`]: {
        marginTop: -theme.spacing(2),
        paddingTop: 0,
        display: 'flex',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        minHeight: theme.spacing(10),
        pointerEvents: 'none',
    },

    [`& .${FilterFormClasses.clearFix}`]: { clear: 'right' },
}));
