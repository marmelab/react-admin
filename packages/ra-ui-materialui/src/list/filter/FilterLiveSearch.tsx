import * as React from 'react';
import { ChangeEvent, memo, useMemo } from 'react';
import { InputAdornment } from '@mui/material';
import { SxProps } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import {
    useTranslate,
    useListFilterContext,
    SourceContextProvider,
    useResourceContext,
    SourceContextValue,
} from 'ra-core';
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
    const resource = useResourceContext(props);

    const {
        source = 'q',
        label = translate('ra.action.search'),
        placeholder,
        ...rest
    } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            setFilters(
                { ...filterValues, [source]: event.target.value },
                null,
                true
            );
        } else {
            const { [source]: _, ...filters } = filterValues;
            setFilters(filters);
        }
    };

    const initialValues = useMemo(
        () => ({
            [source]: filterValues[source],
        }),
        [filterValues, source]
    );

    const form = useForm({ values: initialValues });

    const onSubmit = e => {
        e.preventDefault();
    };

    const sourceContext = React.useMemo<SourceContextValue>(
        () => ({
            getSource: (source: string) => source,
            getLabel: (source: string) =>
                `resources.${resource}.fields.${source}`,
        }),
        [resource]
    );

    return (
        <FormProvider {...form}>
            <SourceContextProvider value={sourceContext}>
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
                            placeholder ??
                            (rest.hiddenLabel ? label : undefined)
                        }
                        {...rest}
                    />
                </form>
            </SourceContextProvider>
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
