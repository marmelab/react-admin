import * as React from 'react';
import { ChangeEvent, memo, useMemo } from 'react';
import { InputAdornment } from '@mui/material';
import { SxProps } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslate, useListFilterContext } from 'ra-core';
import { FormProvider, useForm } from 'react-hook-form';

import { TextInput, TextInputProps } from '../../input';

/**
 * Form and search input for doing a full-text search filter.
 *
 * Triggers a search on change (with debounce).
 *
 * @example
 *
 * const FilterPanel = () => (
 *     <Card>
 *         <CardContent>
 *             <FilterLiveSearch source="title" />
 *         </CardContent>
 *     </Card>
 * );
 */
export const FilterLiveSearch = memo((props: FilterLiveSearchProps) => {
    const { filterValues, setFilters } = useListFilterContext();
    const translate = useTranslate();

    const {
        source = 'q',
        label = translate('ra.action.search'),
        placeholder,
        ...rest
    } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            setFilters({ ...filterValues, [source]: event.target.value }, null);
        } else {
            const { [source]: _, ...filters } = filterValues;
            setFilters(filters, null, false);
        }
    };

    const initialValues = useMemo(
        () => ({
            [source]: filterValues[source],
        }),
        [filterValues, source]
    );

    const form = useForm({ defaultValues: initialValues });

    const onSubmit = e => {
        e.preventDefault();
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={onSubmit}>
                <TextInput
                    resettable
                    helperText={false}
                    source={source}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon color="disabled" />
                            </InputAdornment>
                        ),
                    }}
                    onChange={handleChange}
                    size="small"
                    label={rest.hiddenLabel ? false : label}
                    placeholder={
                        placeholder ?? (rest.hiddenLabel ? label : undefined)
                    }
                    {...rest}
                />
            </form>
        </FormProvider>
    );
});

export interface FilterLiveSearchProps extends Omit<TextInputProps, 'source'> {
    source?: string;
    sx?: SxProps;
    label?: string;
    fullWidth?: boolean;
    variant?: 'filled' | 'outlined';
}
