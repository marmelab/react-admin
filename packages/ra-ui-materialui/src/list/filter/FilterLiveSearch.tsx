import * as React from 'react';
import { ChangeEvent, memo, useMemo } from 'react';
import { InputAdornment } from '@mui/material';
import { SxProps } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { Form, useTranslate, useListFilterContext } from 'ra-core';

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
export const FilterLiveSearch = memo(
    (props: { source?: string; sx?: SxProps }) => {
        const { source = 'q', ...rest } = props;
        const { filterValues, setFilters } = useListFilterContext();
        const translate = useTranslate();

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target) {
                setFilters(
                    { ...filterValues, [source]: event.target.value },
                    null
                );
            } else {
                const { [source]: _, ...filters } = filterValues;
                setFilters(filters, null);
            }
        };

        const initialValues = useMemo(
            () => ({
                [source]: filterValues[source],
            }),
            [filterValues, source]
        );

        const onSubmit = () => undefined;

        return (
            <Form defaultValues={initialValues} onSubmit={onSubmit}>
                <TextInput
                    resettable
                    helperText={false}
                    source={source}
                    placeholder={translate('ra.action.search')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon color="disabled" />
                            </InputAdornment>
                        ),
                    }}
                    onChange={handleChange}
                    size="small"
                    label={false}
                    hiddenLabel
                    {...rest}
                />
            </Form>
        );
    }
);
