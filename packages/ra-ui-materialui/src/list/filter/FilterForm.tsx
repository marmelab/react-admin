import * as React from 'react';
import {
    HtmlHTMLAttributes,
    ReactNode,
    useEffect,
    useCallback,
    useContext,
} from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
    ListFilterContextValue,
    useListContext,
    useResourceContext,
} from 'ra-core';
import {
    FieldValues,
    FormProvider,
    useForm,
    useFormContext,
} from 'react-hook-form';
import classnames from 'classnames';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';

import { FilterFormInput } from './FilterFormInput';
import { FilterContext } from '../FilterContext';

export const FilterForm = (props: FilterFormProps) => {
    const { filters: filtersProps, ...rest } = props;

    const { setFilters, displayedFilters, filterValues } = useListContext(
        props
    );
    const filters = useContext(FilterContext) || filtersProps;

    const form = useForm({
        defaultValues: filterValues,
    });

    // Reapply filterValues when the URL changes or a user removes a filter
    useEffect(() => {
        form.reset(filterValues);
    }, [filterValues, filters, form]);

    useEffect(() => {
        const subscription = form.watch(async (values, { name, type }) => {
            // We must check whether the form is valid as watch will not check that for us.
            // We can't rely on form state as it might not be synchronized yet
            const isFormValid = await form.trigger();

            if (isFormValid) {
                if (lodashGet(values, name) === '') {
                    const newValues = cloneDeep(values);
                    lodashSet(newValues, name, undefined);
                    setFilters(newValues, displayedFilters);
                } else {
                    setFilters(values, displayedFilters);
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [displayedFilters, form, setFilters]);

    return (
        <FormProvider {...form}>
            <FilterFormBase
                onSubmit={handleFormSubmit}
                filters={filters}
                {...rest}
            />
        </FormProvider>
    );
};

export type FilterFormProps = FilterFormBaseProps & {
    defaultValues?: FieldValues;
};

export const FilterFormBase = (props: FilterFormBaseProps) => {
    const { className, margin, filters, variant, ...rest } = props;
    const resource = useResourceContext(props);
    const form = useFormContext();
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

    const getShownFilters = () => {
        const values = form.getValues();
        return filters.filter(
            (filterElement: JSX.Element) =>
                filterElement.props.alwaysOn ||
                displayedFilters[filterElement.props.source] ||
                typeof lodashGet(values, filterElement.props.source) !==
                    'undefined'
        );
    };

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
}: Partial<FilterFormBaseProps> & { hasCreate?: boolean }) => props;

export type FilterFormBaseProps = Omit<
    HtmlHTMLAttributes<HTMLFormElement>,
    'children'
> &
    Partial<ListFilterContextValue> & {
        className?: string;
        resource?: string;
        filters?: ReactNode[];
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
