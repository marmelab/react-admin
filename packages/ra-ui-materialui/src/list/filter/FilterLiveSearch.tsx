import * as React from 'react';
import { ChangeEvent, memo, useMemo } from 'react';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslate, useListFilterContext } from 'ra-core';

import { TextInput } from '../../input';

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
export const FilterLiveSearch = memo((props: { source?: string }) => {
    const { source = 'q', ...rest } = props;
    const { filterValues, setFilters } = useListFilterContext();
    const translate = useTranslate();
    const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            setFilters({ ...filterValues, [source]: event.target.value }, null);
        } else {
            const { [source]: _, ...filters } = filterValues;
            setFilters(filters, null);
        }
    };

    const defaultValues = useMemo(
        () => ({
            [source]: filterValues[source],
        }),
        [filterValues, source]
    );
    const form = useForm({
        defaultValues,
    });

    const onSubmit = () => undefined;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <TextInput
                    resettable
                    helperText={false}
                    source={source}
                    label={translate('ra.action.search')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon color="disabled" />
                            </InputAdornment>
                        ),
                    }}
                    onChange={onSearchChange}
                    {...rest}
                />
            </form>
        </FormProvider>
    );
});
