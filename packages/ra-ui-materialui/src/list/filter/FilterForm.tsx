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
import {
    ListFilterContextValue,
    useListContext,
    useResourceContext,
} from 'ra-core';
import { FormProvider, useForm } from 'react-hook-form';
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
    displayedFilters,
    filterValues,
    hasCreate,
    hideFilter,
    setFilters,
    resource,
    ...props
}: Partial<FilterFormProps> & { hasCreate?: boolean }) => props;

export type FilterFormProps = Omit<
    HtmlHTMLAttributes<HTMLFormElement>,
    'children'
> &
    Partial<ListFilterContextValue> & {
        className?: string;
        resource?: string;
        filters: ReactNode[];
        initialValues?: any;
        margin?: 'none' | 'normal' | 'dense';
        variant?: 'standard' | 'outlined' | 'filled';
    };

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
    const { filters: filtersProps, initialValues } = props;

    const { setFilters, displayedFilters, filterValues } = useListContext(
        props
    );
    const filters = useContext(FilterContext) || filtersProps;

    const mergedInitialValuesWithDefaultValues = mergeInitialValuesWithDefaultValues(
        initialValues || filterValues,
        filters
    );
    const form = useForm({
        defaultValues: mergedInitialValuesWithDefaultValues,
    });

    const handleChange = values => {
        setFilters(values, displayedFilters);
    };

    return (
        <FormProvider {...form}>
            <FilterFormBase
                onChange={form.handleSubmit(handleChange)}
                onSubmit={handleFormSubmit}
                filters={filters}
                initialValues={mergedInitialValuesWithDefaultValues}
                {...props}
            />
        </FormProvider>
    );
};

const handleFormSubmit = () => {};

const PREFIX = 'RaFilterForm';

export const FilterFormClasses = {
    form: `${PREFIX}-form`,
    clearFix: `${PREFIX}-clearFix`,
};

const StyledForm = styled('form', { name: PREFIX })(({ theme }) => ({
    [`&.${FilterFormClasses.form}`]: {
        marginTop: theme.spacing(-1),
        minHeight: theme.spacing(8),
        display: 'flex',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        pointerEvents: 'none',
    },

    [`& .${FilterFormClasses.clearFix}`]: { clear: 'right' },
}));
