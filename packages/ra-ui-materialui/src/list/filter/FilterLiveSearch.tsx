import * as React from 'react';
import { ChangeEvent, memo, useMemo } from 'react';
import { InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Form } from 'react-final-form';
import { useTranslate, useListFilterContext } from 'ra-core';

import TextInput from '../../input/TextInput';

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
const FilterLiveSearch = (props: { source?: string }) => {
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

    const initialValues = useMemo(
        () => ({
            [source]: filterValues[source],
        }),
        [filterValues, source]
    );

    const onSubmit = () => undefined;

    return (
        <Form initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
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
            )}
        </Form>
    );
};

export default memo(FilterLiveSearch);
