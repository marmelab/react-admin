import { styled } from '@mui/material/styles';
import get from 'lodash/get';
import { FilterLiveForm, useListContext, useResourceContext } from 'ra-core';
import * as React from 'react';
import {
    HtmlHTMLAttributes,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
} from 'react';
import { useFormContext } from 'react-hook-form';

import { FilterContext } from '../FilterContext';
import { FilterFormInput } from './FilterFormInput';

export const FilterForm = (props: FilterFormProps) => {
    const { filters: filtersProps, ...rest } = props;
    const filters = useContext(FilterContext) || filtersProps;

    return (
        <FilterLiveForm formComponent={StyledForm} {...sanitizeRestProps(rest)}>
            <FilterFormBase filters={filters} />
        </FilterLiveForm>
    );
};

export type FilterFormProps = FilterFormBaseProps;

export const FilterFormBase = (props: FilterFormBaseProps) => {
    const { filters } = props;
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

    return (
        <>
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
        </>
    );
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
