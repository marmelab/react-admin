import * as React from 'react';
import {
    HtmlHTMLAttributes,
    ReactNode,
    useEffect,
    useCallback,
    useContext,
} from 'react';
import { styled } from '@mui/material/styles';
import {
    FormGroupsProvider,
    SourceContextProvider,
    SourceContextValue,
    useListContext,
    useResourceContext,
} from 'ra-core';
import {
    FieldValues,
    FormProvider,
    useForm,
    useFormContext,
} from 'react-hook-form';
import set from 'lodash/set';
import unset from 'lodash/unset';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import { FilterFormInput } from './FilterFormInput';
import { FilterContext } from '../FilterContext';

export const FilterForm = (props: FilterFormProps) => {
    const { defaultValues, filters: filtersProps, ...rest } = props;

    const { setFilters, displayedFilters, filterValues } = useListContext();
    const filters = useContext(FilterContext) || filtersProps;

    const mergedInitialValuesWithDefaultValues =
        mergeInitialValuesWithDefaultValues(
            defaultValues || filterValues,
            filters
        );

    const form = useForm({
        defaultValues: mergedInitialValuesWithDefaultValues,
    });
    const { getValues, reset, trigger, watch } = form;

    // Reapply filterValues when the URL changes or a user removes a filter
    useEffect(() => {
        const newValues = getFilterFormValues(getValues(), filterValues);
        const previousValues = getValues();
        if (!isEqual(newValues, previousValues)) {
            reset(newValues);
        }
        // The reference to the filterValues object is not updated when it changes,
        // so we must stringify it to compare it by value and also compare the reference.
        // This makes it work for both input values and filters applied directly through
        // the ListContext.setFilter (e.g. QuickFilter in the simple example)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filterValues), filterValues, getValues, reset]);

    useEffect(() => {
        const subscription = watch(async (values, { name }) => {
            // We must check whether the form is valid as watch will not check that for us.
            // We can't rely on form state as it might not be synchronized yet
            const isFormValid = await trigger();

            // Check that the name is present to avoid setting filters when watch was
            // triggered by a change on the ListContext values.
            if (name && isFormValid) {
                if (get(values, name) === '') {
                    const newValues = cloneDeep(values);
                    unset(newValues, name);
                    setFilters(newValues, displayedFilters, true);
                } else {
                    setFilters(values, displayedFilters, true);
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [displayedFilters, setFilters, trigger, watch]);

    return (
        <FormProvider {...form}>
            <FormGroupsProvider>
                <FilterFormBase
                    onSubmit={handleFormSubmit}
                    filters={filters}
                    {...rest}
                />
            </FormGroupsProvider>
        </FormProvider>
    );
};

export type FilterFormProps = FilterFormBaseProps & {
    defaultValues?: FieldValues;
};

export const FilterFormBase = (props: FilterFormBaseProps) => {
    const { className, filters, ...rest } = props;
    const resource = useResourceContext(props);
    const form = useFormContext();
    const { displayedFilters = {}, hideFilter } = useListContext();

    useEffect(() => {
        if (!filters) return;
        filters.forEach((filter: JSX.Element) => {
            if (filter.props.alwaysOn && filter.props.defaultValue) {
                throw new Error(
                    'Cannot use alwaysOn and defaultValue on a filter input. Please set the filterDefaultValues props on the <List> element instead.'
                );
            }
        });
    }, [filters]);

    const getShownFilters = () => {
        if (!filters) return [];
        const values = form.getValues();
        return filters.filter((filterElement: JSX.Element) => {
            const filterValue = get(values, filterElement.props.source);
            return (
                filterElement.props.alwaysOn ||
                displayedFilters[filterElement.props.source] ||
                !isEmptyValue(filterValue)
            );
        });
    };

    const handleHide = useCallback(
        event => hideFilter(event.currentTarget.dataset.key),
        [hideFilter]
    );

    const sourceContext = React.useMemo<SourceContextValue>(
        () => ({
            getSource: (source: string) => source,
            getLabel: (source: string) =>
                `resources.${resource}.fields.${source}`,
        }),
        [resource]
    );

    return (
        <SourceContextProvider value={sourceContext}>
            <StyledForm
                className={className}
                {...sanitizeRestProps(rest)}
                onSubmit={handleSubmit}
            >
                {getShownFilters().map((filterElement: JSX.Element) => (
                    <FilterFormInput
                        key={filterElement.key || filterElement.props.source}
                        filterElement={filterElement}
                        handleHide={handleHide}
                        resource={resource}
                        className={FilterFormClasses.filterFormInput}
                    />
                ))}
                <div className={FilterFormClasses.clearFix} />
            </StyledForm>
        </SourceContextProvider>
    );
};

const handleSubmit = event => {
    event.preventDefault();
    return false;
};

const sanitizeRestProps = ({
    hasCreate,
    resource,
    ...props
}: Partial<FilterFormBaseProps> & { hasCreate?: boolean }) => props;

export type FilterFormBaseProps = Omit<
    HtmlHTMLAttributes<HTMLFormElement>,
    'children'
> & {
    className?: string;
    resource?: string;
    filters?: ReactNode[];
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
                set(
                    { ...acc },
                    filterElement.props.source,
                    filterElement.props.defaultValue
                ),
            {} as any
        ),
    ...initialValues,
});

const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

const PREFIX = 'RaFilterForm';

export const FilterFormClasses = {
    clearFix: `${PREFIX}-clearFix`,
    filterFormInput: `${PREFIX}-filterFormInput`,
};

const StyledForm = styled('form', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flex: '0 1 auto',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
        minHeight: theme.spacing(8),
    },
    [theme.breakpoints.up('md')]: {
        flex: '0 1 100%',
    },
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    pointerEvents: 'none',
    padding: `0 0 ${theme.spacing(0.5)} 0`,
    '& .MuiFormHelperText-root': { display: 'none' },
    [`& .${FilterFormClasses.clearFix}`]: { clear: 'right' },
    [`& .${FilterFormClasses.filterFormInput} .MuiFormControl-root`]: {
        marginTop: `${theme.spacing(1)}`,
    },
}));

/**
 * Because we are using controlled inputs with react-hook-form, we must provide a default value
 * for each input when resetting the form. (see https://react-hook-form.com/docs/useform/reset).
 * To ensure we don't provide undefined which will result to the current input value being reapplied
 * and due to the dynamic nature of the filter form, we rebuild the filter form values from its current
 * values and make sure to pass at least an empty string for each input.
 */
export const getFilterFormValues = (
    formValues: Record<string, any>,
    filterValues: Record<string, any>
) => {
    return Object.keys(formValues).reduce(
        (acc, key) => {
            acc[key] = getInputValue(formValues, key, filterValues);
            return acc;
        },
        cloneDeep(filterValues) ?? {}
    );
};

const getInputValue = (
    formValues: Record<string, any>,
    key: string,
    filterValues: Record<string, any>
) => {
    if (formValues[key] === undefined || formValues[key] === null) {
        return '';
    }
    if (Array.isArray(formValues[key])) {
        return get(filterValues, key, '');
    }
    if (formValues[key] instanceof Date) {
        return get(filterValues, key, '');
    }
    if (typeof formValues[key] === 'object') {
        const inputValues = Object.keys(formValues[key]).reduce(
            (acc, innerKey) => {
                const nestedInputValue = getInputValue(
                    formValues[key],
                    innerKey,
                    (filterValues || {})[key] ?? {}
                );
                acc[innerKey] = nestedInputValue;
                return acc;
            },
            {}
        );
        if (!Object.keys(inputValues).length) return '';
        return inputValues;
    }
    return get(filterValues, key, '');
};

const isEmptyValue = (filterValue: unknown) => {
    if (filterValue === '' || filterValue == null) return true;

    // If one of the value leaf is not empty
    // the value is considered not empty
    if (typeof filterValue === 'object') {
        return Object.keys(filterValue).every(key =>
            isEmptyValue(filterValue[key])
        );
    }

    return false;
};
